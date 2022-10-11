import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { Responses } from '../../common/responses';
import { LoanRepository } from '../../repository/loan.repository';
import { LastScreenModel } from '../../common/last-screen.model';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';

export enum Status {
  Approved = 'Approved',
  Declined = 'Denied',
}

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(UserBankAccountRepository)
    private readonly userBankAccountsRepository: UserBankAccountRepository,
  ) {}

  async getOffer(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({
        where: { id: loanId },
        select: ['apr', 'maxLoanAmount', 'status_flag', 'maxLoanTerm'],
      });
      loan.lastScreen = LastScreenModel.GetOffer;
      await loan.save();

      if (!loan) return { message: 'Customer not found' };

      return {
        status: loan.status_flag,
        apr: loan.apr,
        maxLoanAmount: loan.maxLoanAmount,
        maxLoanTerm: loan.maxLoanTerm,
      };
    } catch (e) {
      Responses.fatalError(e);
    }
  }

  async getLoanDisbursement(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({
        where: { id: loanId },
        select: ['actualLoanAmount'],
      });
      if (!loan) return { message: 'Customer not found' };
      loan.lastScreen = LastScreenModel.LoanDisbursement;
      await loan.save();

      const bankAccounts = await this.userBankAccountsRepository.find({
        where: { loan_id: loanId },
        select: ['account_id', 'account_number', 'account_name'],
      });
      if (!bankAccounts) return { message: 'Bank Accounts not found' };

      const accounts = bankAccounts.map(bankAccount => ({
        id: bankAccount.account_id,
        accountNumberDisplay: bankAccount.account_number,
        name: bankAccount.account_name,
      }));

      return {
        accounts,
        loan_proceed_amount: loan.actualLoanAmount,
      };
    } catch (e) {
      Responses.fatalError(e);
    }
  }

  async getLoanPayment(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({
        where: { id: loanId },
      });
      loan.lastScreen = LastScreenModel.LoanPayment;
      if (!loan) return { message: 'Customer not found' };
      await loan.save();

      const bankAccounts = await this.userBankAccountsRepository.find({
        where: { loan_id: loanId },
        select: ['account_id', 'account_number', 'account_name'],
      });
      if (!bankAccounts) return { message: 'Bank Accounts not found' };

      const frequencyDescription = `Monthly, on the ${loan.dayOfMonth} day of each month`;

      return {
        payment_frequency: frequencyDescription,
        accounts: bankAccounts.map(bankAccount => ({
          id: bankAccount.account_id,
          accountNumberDisplay: bankAccount.account_number,
          name: bankAccount.account_name,
        })),
      };
    } catch (e) {
      Responses.fatalError(e);
    }
  }
}
