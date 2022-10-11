import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../../repository/loan.repository';
import { PreBureauService } from '../pre-bureau/pre-bureau.service';
import { CustomerRepository } from '../../../repository/customer.repository';
import { CreditPullRepository } from '../../../repository/creditPull.repository';
import { Vendors } from '../../../entities/creditPull.entity';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../../../common/log.service';
import { Loan, StatusFlags } from '../../../entities/loan.entity';
import { TransunionService } from '../transunion/transunion.service';

class DecisionResponse {
  approvedRuleMsg: string[];
  declinedRuleMsg: string[];
  declinedRules: string[];
  loanApproved: boolean;
  ruleApprovals: any;
  ruleData: any;
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class ProductService {
  readonly resultDefault = {
    approvedRuleMsg: [],
    declinedRuleMsg: [],
    declinedRules: [],
    loanApproved: true,
    ruleApprovals: {},
    ruleData: {},
  };

  constructor(
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @InjectRepository(CreditPullRepository)
    private creditPullRepository: CreditPullRepository,
    private preBureauService: PreBureauService,
    private readonly configService: ConfigService,
    private logService: LogService,
    private transunionService: TransunionService,
  ) {}

  async underWriting(loanId) {
    const firstStage = await this.runStage1Rules(loanId);

    this.logService.addLogs(loanId, 'Start soft TU pull');
    await this.transunionService.runCreditReport(false, loanId);
    this.logService.addLogs(loanId, 'Done soft TU pull');

    if (firstStage.loanApproved) {
      // fetch data from transunion
      this.runStage2Rules(loanId);
    }
  }

  async runStage1Rules(loanId: string): Promise<DecisionResponse> {
    this.logService.addLogs(loanId, `Stage 1 Decisioning start`);

    const rules = this.configService.get('stage1Rules');

    const values = await this.stage1Values(loanId);

    const decision = this.decisioningRun(loanId, rules, values);

    this.logService.addLogs(
      loanId,
      `Stage 1 Decision ${
        decision.loanApproved ? 'Approved' : 'Declined'
      }: ${JSON.stringify(decision.declinedRuleMsg)}`,
    );

    if (!decision.loanApproved) {
      this.updateLoanStatus(loanId, decision);
    }

    return decision;
  }

  private updateLoanStatus(loanId, decision) {
    this.loanRepository.update(
      { id: loanId },
      {
        status_flag: decision.loanApproved
          ? StatusFlags.approved
          : StatusFlags.denied,
        status: decision.declinedRules.join(', '),
      },
    );
  }

  async runStage2Rules(loanId: string): Promise<DecisionResponse> {
    this.logService.addLogs(loanId, `Stage 2 Decisioning start`);
    const rules = this.configService.get('stage2Rules');
    const values = await this.stage2Values(loanId);

    const decision = this.decisioningRun(loanId, rules, values);

    this.logService.addLogs(
      loanId,
      `Stage 2 Decision ${
        decision.loanApproved ? 'Approved' : 'Declined'
      }: ${JSON.stringify(decision.declinedRuleMsg)}`,
    );

    this.updateLoanStatus(loanId, decision);

    return decision;
  }

  decisioningRun(loanId: string, rules, ruleUserValueFuncs) {
    const result = { ...this.resultDefault };

    try {
      Object.keys(rules).forEach(ruleKey => {
        const rule = rules[ruleKey];
        if (
          !rule.disabled &&
          ruleUserValueFuncs[ruleKey] &&
          typeof ruleUserValueFuncs[ruleKey] === 'function'
        ) {
          result.ruleData[rule.ruleId] = {
            description: rule.description,
            message: 'Not applied',
            passed: true,
            ruleId: rule.ruleId,
            userValue: null,
          };
          const userValue = ruleUserValueFuncs[ruleKey]();
          const { passed, message } = this.getRulePassedMessage(
            rule,
            userValue,
            loanId,
          );
          result.ruleData[rule.ruleId].message = message;
          result.ruleData[rule.ruleId].passed = passed;
          result.ruleData[rule.ruleId].userValue = userValue;
          if (!passed) {
            result.loanApproved = false;
          }
          if (result.ruleData[rule.ruleId].passed) {
            result.approvedRuleMsg.push(result.ruleData[rule.ruleId].message);
          } else {
            result.declinedRuleMsg.push(result.ruleData[rule.ruleId].message);
            result.declinedRules.push(rule.ruleId);
          }
          result.ruleApprovals[rule.ruleId] = result.ruleData[rule.ruleId].passed
            ? 1
            : 0;
        }
      });
    } catch (e) {

    }

    return result;
  }

  async stage1Values(loanId: string) {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    const report = await this.preBureauService.generalReport(loanId, loan.customer_id);
    const {
      settledOrChargedOffLoansCount,
      lastPastDue,
      lastDeclinedLoanDays,
      averageBalance,
      numberOfOverdrafts,
    } = report;

    this.logService.addLogs(loanId, JSON.stringify(report));

    return {
      rule1: () => {
        return settledOrChargedOffLoansCount > 0;
      },
      rule2: () => {
        return lastPastDue;
      },
      rule3: () => {
        return lastDeclinedLoanDays;
      },
      rule4: () => {
        return loan.annualIncome;
      },
      rule5: () => {
        return averageBalance;
      },
      rule6: () => {
        return numberOfOverdrafts;
      },
    };
  }

  async getFinicityIncome(loanId: string) {
    const creditPullFinicity = await this.creditPullRepository.findOne({
      where: {
        loan_id: loanId,
        vendor: Vendors.finicity,
      },
      select: ['file'],
      order: {
        created_at: 'DESC',
      },
    });
    let income = 0;

    try {
      const {
        income: { netAnnualIncome },
      } = JSON.parse(creditPullFinicity.file)?.ca360_data;
      income = netAnnualIncome * this.configService.get('grossIncomeModifier');
    } catch (e) {
      this.logService.errorLogs(loanId, 'Failed to get Finicity Income', e);
    }

    return income;
  }

  async stage2Values(loanId: string) {
    const report = await this.transunionService.getTUReport(loanId);
    const {
      OFAC06800,
      creditUsageAT20,
      monthSince90DayRateS062,
      numberOfBankruptciesPBN003,
      numberOfDelinquenciesG061,
      numberOfNonMedicalCollectionsS073B,
      numberOfPublicRecordsS059,
      numberOfInquiriesG098,
      scoreFICO,
      DTI,
      grossIncome,
    } = report;

    this.logService.addLogs(loanId, JSON.stringify(report));

    const finicityIncome = await this.getFinicityIncome(loanId);

    const loan = await this.loanRepository.findOne({
      where: { id: loanId },
    });

    const tier = this.configService.get('tier')(scoreFICO);
    const PTI = this.getPTI(loan, tier);

    this.setOfferParams(loan, tier, scoreFICO);

    return {
      rule7: () => {
        return OFAC06800;
      },
      rule8: () => {
        return creditUsageAT20;
      },
      rule9: () => {
        return monthSince90DayRateS062;
      },
      rule10: () => {
        return numberOfBankruptciesPBN003;
      },
      rule11: () => {
        return numberOfDelinquenciesG061;
      },
      rule12: () => {
        return numberOfNonMedicalCollectionsS073B;
      },
      rule13: () => {
        return numberOfPublicRecordsS059;
      },
      rule14: () => {
        return numberOfInquiriesG098;
      },
      rule15: () => {
        return scoreFICO;
      },
      rule16: () => {
        return DTI;
      },
      rule17: () => {
        return PTI;
      },
      rule18: () => {
        return (
          loan.annualIncome <= grossIncome ||
          loan.annualIncome <=
            this.configService.get('incomeVerificationCoefficient') *
              finicityIncome
        );
      },
    };
  }

  getPTI(loan, tier) {
    const monthInYear = 12;
    const minLoanAmount = this.configService.get('minimumLoanAmount');
    const minLoanTerm = this.configService.get('minimumLoanTerm');
    const minLoanTermInYears = minLoanTerm / monthInYear;
    const monthlyIncome = loan.annualIncome / monthInYear;
    const loanAmountWithApr =
      minLoanAmount + minLoanAmount * tier * minLoanTermInYears;
    const monthlyPayment = loanAmountWithApr / minLoanTerm;

    return monthlyPayment / monthlyIncome;
  }

  getRulePassedMessage(
    rule: Record<string, any>,
    userValue: any,
    requestId: string,
  ) {
    let passed = true;
    let relation = '';
    switch (rule.declinedIf) {
      case 'eq':
        passed = rule.value !== userValue;
        passed ? (relation = '!=') : (relation = '=');
        break;
      case 'ne':
        passed = rule.value === userValue;
        passed ? (relation = '=') : (relation = '!=');
        break;
      case 'gt':
        if (userValue > rule.value) passed = false;
        passed ? (relation = '<=') : (relation = '>');
        break;
      case 'lt':
        if (userValue < rule.value) passed = false;
        passed ? (relation = '>=') : (relation = '<');
        break;
      case 'gte':
        if (userValue >= rule.value) passed = false;
        passed ? (relation = '<') : (relation = '>=');
        break;
      case 'lte':
        if (userValue <= rule.value) passed = false;
        passed ? (relation = '>') : (relation = '<=');
        break;
      default:
        throw new BadRequestException(
          `${rule.declinedIf} is not a supported rule operator. Request: ${requestId}`,
        );
    }

    return {
      message: `${rule.ruleId}: ${rule.description} ${relation} ${
        rule.value
      } then ${passed ? 'pass' : 'decline'}`,
      passed,
    };
  }

  setOfferParams(loan: Loan, tier: number, scoreFICO: number) {
    const monthInYear = 12;
    const monthMaximumIncomePart = 10;
    const maxAmountModifier = 0.1;
    const percentageCoefficient = 1000;
    const roundCoefficient = 100;
    const jsDecimalHack = 10;

    loan.apr = Math.round(tier * percentageCoefficient) / jsDecimalHack;
    loan.maxLoanAmountFactorA =
      (loan.annualIncome - loan.annualIncome * tier) /
      monthInYear /
      monthMaximumIncomePart /
      maxAmountModifier;

    loan.maxLoanAmountFactorB = this.configService.get('factorB')(scoreFICO);

    // hack js floor
    loan.maxLoanAmount =
      Math.floor(
        Math.min(loan.maxLoanAmountFactorA, loan.maxLoanAmountFactorB) /
          roundCoefficient,
      ) * roundCoefficient;

    loan.maxLoanTerm = this.configService.get('loanTerm')(loan.maxLoanAmount);

    loan.save();

    return loan;
  }
}
