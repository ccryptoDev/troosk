import {
  BadRequestException,
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { CustomerEntity } from '../../entities/customer.entity';
import { LoanRepository } from '../../repository/loan.repository';
import { Loan, LoanPaymentFrequency } from '../../entities/loan.entity';
import { Responses } from '../../common/responses';
import { CommonService } from '../../common/helper-service';
import { getLoanAgreement } from './contract/loan-agreement';
import * as moment from 'moment';
import { LastScreenModel } from '../../common/last-screen.model';
import {
  UserBankAccountRepository,
} from '../../repository/user-bank-account.repository';
import {
  Flags,
  UserBankAccountsEntity,
} from '../../entities/user-bank-accounts.entity';
import {
  PaymentScheduleService,
} from '../payment-schedule/payment-schedule.service';
import { FinicityClient } from '../finicity/finicity.client';
import { LogService } from '../../common/log.service';
import { RepayClient } from '../../common/repay-client';
import {
  UpdateuserloanService,
} from '../updateuserloan/updateuserloan.service';

interface PaymentSchedule {
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  monthlyPayment: number;
  paymentSchedule: any[];
}

@Injectable()
export class LoanContractService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(UserBankAccountRepository)
    private readonly userBankAccountsRepository: UserBankAccountRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    private readonly finicityClient: FinicityClient,
    private readonly paymentScheduleService: PaymentScheduleService,
    private readonly logService: LogService,
    private readonly userLoanService: UpdateuserloanService,
    private readonly httpService: HttpService
  ) {}

  async getLoanContract(loanId: string) {
    try {
      const customer: CustomerEntity = await this.customerRepository.findOne({
        where: { loan_id: loanId },
      });

      if (!customer) throw new NotFoundException('Loan id is wrong');

      const {
        firstName,
        lastName,
        addressLine1,
        city,
        state,
        finicity_id,
        zipCode,
        phone: mobilePhone,
      } = customer;

      // Create payment schedule and return data;
      const paymentScheduleData = (await this.paymentScheduleService.createPaymentSchedule(
        loanId,
      )) as PaymentSchedule;

      const loan: Loan = await this.loanRepository.findOne({
        where: { id: loanId },
      });

      const loanContractData = {
        customerInfo: {
          name: `${firstName} ${lastName}`,
          address: `${addressLine1}, ${city}, ${state} ${zipCode}`,
          mobilePhone: this.addDashes(mobilePhone),
        },
        bankDetails: await this.getBankDetails(loan, finicity_id),
        loanDetails: {
          id: loanId,
          ref_no: loan.ref_no,
          date: moment(loan.createdAt).format('MM/DD/YYYY'),
          apr: loan.apr,
          financeCharge: loan.financeCharge,
          amountFinanced: loan.actualLoanAmount,
          totalOfPayments: loan.actualLoanAmount + loan.financeCharge,
          numberOfPayments: loan.actualLoanTerm,
          amountOfEachPayment: loan.monthlyPayment,
          paymentDueDate: {
            dayOfMonth: moment(loan.createdAt).format('Do'),
            payFrequency: LoanPaymentFrequency.monthly,
          },
          paymentDueDateText: `Monthly, on the ${moment(loan.createdAt).format(
            'Do',
          )} day of each month, through ${moment(loan.createdAt)
            .add(loan.actualLoanTerm, 'month')
            .format('MMMM YYYY')}`,
        },
        amortizationSchedule: paymentScheduleData.paymentSchedule,
      };
      this.mapDeep(loanContractData);

      return loanContractData;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getBankDetails(loan, finicityId: string) {
    let bankDetails = null;

    try {
      const bankAccount: UserBankAccountsEntity = await this.userBankAccountsRepository.findOne(
        { where: { account_id: loan.payment_method_id } },
      );

      if (bankAccount?.account_id) {
        const bankCredentials = await this.finicityClient.getBankAccountDetails(
          finicityId,
          loan.payment_method_id,
        );
        bankDetails = {
          bankName: bankAccount?.account_name,
          accountType: bankAccount?.ach_account_type,
          accountNumber: bankCredentials.realAccountNumber,
          routingNumber: bankCredentials.routingNumber,
        };
      }
    } catch (e) {
      this.logService.errorLogs(loan.id, e.message, JSON.stringify(e));
    }

    return bankDetails;
  }

  async signLoanContract(loanId: string) {
    // TODO 1. run hard pull
    const loan = await this.loanRepository.findOne({where: {id: loanId}});

    if (loan === undefined || loan.funding === Flags.Y) {
      throw new BadRequestException('Loan already funded or not exist');
    }

    const customer = await this.customerRepository.findOne({where: {id: loan.customer_id}});
    loan.signature = customer.fullName;
    loan.lastScreen = LastScreenModel.Sign;
    this.uploadLoanContractInPdf(loanId);
    const disbursementResult = await this.disbursement(loanId);

    if (disbursementResult) {
      loan.funding = Flags.Y;
      loan.save();
      return Responses.success('Loan contract signed');
    } else {
      loan.save();
      return Responses.validationError('There is error during funding. Please contact our support')
    }
  }

  async uploadLoanContractInPdf(loanId: string) {
    const commonService = new CommonService();
    try {
      const customerInfo = await this.getLoanContract(loanId);
      customerInfo.loanDetails.date = moment(
        customerInfo.loanDetails.date,
      ).format('MM/DD/YYYY');

      const htmlData = getLoanAgreement(customerInfo, loanId);
      const fileName = `loan-contract.pdf`;
      const uploadedContract = await commonService.convertHTMLToPDF(
        loanId,
        htmlData,
        fileName,
      );
      return Responses.success('Saved', uploadedContract);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getLoanContractInPdf(loanId) {
    const commonService = new CommonService();
    let res = null;

    try {
      res = await commonService.getFileFromS3(`loan-contract-${loanId}.pdf`);
    } catch (e) {
      return new BadRequestException('Loan contract was not found');
    }

    await this.loanRepository.update(
      { id: loanId },
      { lastScreen: LastScreenModel.LoanContract },
    );

    return Responses.success('Success', {
      fileName: 'Loan agreement document',
      fileData: JSON.stringify(res.Body),
    });
  }

  async getLoanContractInHTML(loanId) {
    try {
      const customerInfo = await this.getLoanContract(loanId);
      customerInfo.loanDetails.date = moment(
        customerInfo.loanDetails.date,
      ).format('MM/DD/YYYY');

      const agreementData = getLoanAgreement(customerInfo, loanId);

      return Responses.success('Success', {
        agreementData,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private mapDeep(obj) {
    for (const prop in obj) {
      if (obj[prop] === Object(obj[prop])) this.mapDeep(obj[prop]);
      else if (obj[prop] === undefined) obj[prop] = '-';
    }
  }

  private addDashes(phoneNumber: string) {
    const num = phoneNumber.replace(/\D[^\.]/g, '');
    return num.slice(0, 3) + '-' + num.slice(3, 6) + '-' + num.slice(6);
  }

  private async disbursement(loanId) {
    await this.logService.addLogs(loanId, 'Start disbursement');

    const {
      disbursement_account_id,
      actualLoanAmount,
      customer_id,
    } = await this.loanRepository.findOne({ where: { id: loanId } });

    let bankAccountsEntity = await this.userBankAccountsRepository.findOne({
      where: { loan_id: loanId, account_id: disbursement_account_id },
    });

    const repay = new RepayClient(this.httpService);

    if (!bankAccountsEntity?.repay_token) {
      bankAccountsEntity = await this.userLoanService.activateACHAccount(loanId, bankAccountsEntity);
    }

    const disbursement = await repay.ACHInstantDisbursement({
      ach_token: bankAccountsEntity.repay_token,
      amount: String(actualLoanAmount),
      customer_id,
    });

    await this.logService.addLogs(loanId, JSON.stringify(disbursement?.data));

    return repay.isSuccess(disbursement);
  }
}
