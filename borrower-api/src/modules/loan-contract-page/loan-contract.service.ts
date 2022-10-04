import {
  BadRequestException,
  HttpStatus,
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
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';
import {
  Flags,
  UserBankAccountsEntity,
} from '../../entities/user-bank-accounts.entity';
import { PaymentScheduleService } from '../payment-schedule/payment-schedule.service';
import { FinicityClient } from '../finicity/finicity.client';

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
        streetAddress,
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
          address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
          mobilePhone,
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
            dayOfMonth: loan.createdAt.getDate(),
            payFrequency: LoanPaymentFrequency.monthly,
          },
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
          accountNumber: bankCredentials.realAccountNumber,
          routingNumber: bankCredentials.routingNumber,
        };
      }
    } catch (e) {}

    return bankDetails;
  }

  async signLoanContract(loanId: string) {
    // TODO 1. run hard pull, set up funding, create contract with signature
    await this.uploadLoanContractInPdf(loanId);
    return Responses.success('Loan contract signed');
  }

  async uploadLoanContractInPdf(loanId: string) {
    const commonService = new CommonService();
    try {
      const customerInfo = await this.getLoanContract(loanId);
      customerInfo.loanDetails.date = moment(
        customerInfo.loanDetails.date,
      ).format('MM/DD/YYYY');
      const endDate = moment(customerInfo.loanDetails.date)
        .add(customerInfo.loanDetails.numberOfPayments, 'M')
        .format('MM/DD/YYYY');

      const htmlData = getLoanAgreement(customerInfo, loanId, endDate);
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
      const endDate = moment(customerInfo.loanDetails.date)
        .add(customerInfo.loanDetails.numberOfPayments, 'M')
        .format('MM/DD/YYYY');

      const agreementData = getLoanAgreement(customerInfo, loanId, endDate);

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
}
