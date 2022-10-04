import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinicityClient } from './finicity.client';
import { Responses } from '../../common/responses';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UserBankAccountsRepository } from '../../repository/user-bank-accounts.repository';
import { UserBankAccountsEntity } from '../../entities/user-bank-accounts.entity';

@Injectable()
export class FinicityService {
  constructor(
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @InjectRepository(UserBankAccountsRepository)
    private userBankAccountsRepository: UserBankAccountsRepository,
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    @Inject(FinicityClient) private finicityClient: FinicityClient,
  ) {}

  async bankLink(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({ id: loanId });
      const customer = await this.customerRepository.findOne({
        id: loan.customer_id,
      });

      if (customer === undefined) {
        return Responses.validationError(
          'There is no such customer, please double check your input',
        );
      }

      if (!customer.finicity_id) {
        let finicityCustomer = await this.finicityClient.findFinicityCustomer(
          customer.id,
        );

        if (!finicityCustomer) {
          finicityCustomer = await this.finicityClient.addFinicityCustomer(
            loanId,
          );
        }

        customer.finicity_id = finicityCustomer.id;
        await this.customerRepository.save(customer);
      }

      const finicityLink = await this.finicityClient.bankUrl(
        customer.finicity_id,
      );

      return Responses.success(
        'Link generated successfully',
        finicityLink.link,
      );
    } catch (error) {
      Responses.fatalError(error);
    }
  }

  async bankAccounts(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({ id: loanId });
      const customer = await this.customerRepository.findOne({
        id: loan.customer_id,
      });
      return Responses.success(
        await this.finicityClient.bankAccounts(customer.finicity_id),
      );
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async finicityWebHook(loanId: string) {
    try {
      const fetchedBankAccountsResponse = await this.bankAccounts(loanId);
      const accounts = fetchedBankAccountsResponse.message[0]?.accounts;
      if (!accounts?.length)
        return Responses.validationError(
          'Bank accounts were not fetched from finicity',
        );

      const costumer = await this.customerRepository.findOne({
        where: { loan_id: loanId },
      });

      const newBankAccountsArray = [];
      for (const fetchedBankAccount of accounts) {
        const newBankAccount = new UserBankAccountsEntity();
        newBankAccount.loan_id = loanId;
        newBankAccount.account_id = fetchedBankAccount.id;
        newBankAccount.account_name = fetchedBankAccount.name;
        newBankAccount.account_number = fetchedBankAccount.accountNumberDisplay;
        newBankAccount.name_on_check = `${costumer.firstName} ${costumer.lastName}`;
        newBankAccount.ach_account_type = this.firstCharToUpperCase(
          fetchedBankAccount.type,
        );
        newBankAccountsArray.push(newBankAccount);
      }

      const savedBankAccounts = await this.userBankAccountsRepository.save(
        newBankAccountsArray,
      );
      if (!savedBankAccounts?.length)
        return Responses.validationError('Bank accounts were not saved');

      return Responses.success('Bank accounts were saved', savedBankAccounts);
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async getBankAccountDetails(loanId: string, accountId: string) {
    try {
      const loan = await this.loanRepository.findOne({ id: loanId });
      const customer = await this.customerRepository.findOne({
        id: loan.customer_id,
      });

      return this.finicityClient.getBankAccountDetails(
        customer.finicity_id,
        accountId,
      );
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  private firstCharToUpperCase = (stringItem: string) =>
    stringItem[0].toUpperCase() + stringItem.substring(1);
}
