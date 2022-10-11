import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinicityClient } from './finicity.client';
import { Responses } from '../../common/responses';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import {
  UserBankAccountRepository,
} from '../../repository/user-bank-account.repository';
import {
  AccountType,
  UserBankAccountsEntity,
} from '../../entities/user-bank-accounts.entity';
import { CreditPullRepository } from '../../repository/creditPull.repository';
import { CreditPull, Vendors } from '../../entities/creditPull.entity';
import { LogService } from '../../common/log.service';
import { ProductService } from '../underwriting/product/product.service';
import { LastScreenModel } from '../../common/last-screen.model';
import { StatusFlags, Verify } from '../../entities/loan.entity';

export interface Owner {
  ownerName: string;
  ownerAddress: string;
  asOfDate: number;
}

@Injectable()
export class FinicityService {
  constructor(
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    private finicityClient: FinicityClient,
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @InjectRepository(CreditPullRepository)
    private creditPullRepository: CreditPullRepository,
    @InjectRepository(UserBankAccountRepository)
    private userBankAccountsRepository: UserBankAccountRepository,

    private productService: ProductService,
    private logService: LogService,
  ) {}

  async bankLink(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({ id: loanId });
      loan.lastScreen = LastScreenModel.BankLink;
      await loan.save();

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
            loan.customer_id,
          );
        }

        customer.finicity_id = finicityCustomer.id;
        await this.customerRepository.save(customer);
      }

      const finicityLink = await this.finicityClient.bankUrl(
        customer.finicity_id,
        loanId,
      );

      loan.status_flag = StatusFlags.pending;
      loan.save();

      return Responses.success(
        'Link generated successfully',
        finicityLink.link,
      );
    } catch (error) {
      this.logService.errorLogs(loanId, error.message, error);
      Responses.fatalError(error);
    }
  }

  async bankAccounts(loanId: string) {
    try {
      const loan = await this.loanRepository.findOne({ id: loanId });

      const customer = await this.customerRepository.findOne({
        id: loan.customer_id,
      });

      const bankAccounts = await this.finicityClient.bankAccounts(
        customer.finicity_id,
      );

      if (bankAccounts?.length && loan.verificationStatus === Verify.warning) {
        // todo filter accounts to use only accounts which matched with last name
        for (const bankAccount of bankAccounts) {
          try {
            const owner: Owner = await this.finicityClient.getOwner(
              bankAccount.customerId,
              bankAccount.id,
            );

            const matchName =
              customer.lastName === owner.ownerName.split(' ')[1];
            if (!matchName) {
              this.logService.addLogs(
                loanId,
                `Applicant’s Last name does not match with Last name on bank account ${bankAccount.id}`,
              );
              loan.status = 'V13';
              loan.status_flag = StatusFlags.cancelled;
            } else {
              loan.status = '';
              loan.status_flag = StatusFlags.waiting;
              break;
            }
          } catch (e) {
            throw new InternalServerErrorException(e);
          }
        }
      }

      await loan.save();

      return bankAccounts;
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async saveBankAccounts(loanId): Promise<void> {
    try {
      const fetchedBankAccountsResponse = await this.bankAccounts(loanId);
      const { accounts } = fetchedBankAccountsResponse;
      const costumer = await this.customerRepository.findOne({
        where: { loan_id: loanId },
      });

      if (!accounts?.length) {
        this.logService.addLogs(
          loanId,
          'Unable to access or login to applicant’s bank account',
        );
        await this.loanRepository.update(
          { id: loanId },
          { status_flag: StatusFlags.cancelled, status: 'V12' }
        );
      } else {
        const newBankAccountsArray = [];
        for (const fetchedBankAccount of accounts) {
          const newBankAccount = new UserBankAccountsEntity();
          newBankAccount.loan_id = loanId;
          newBankAccount.account_id = fetchedBankAccount.id;
          newBankAccount.account_name = fetchedBankAccount.name;
          newBankAccount.account_number =
            fetchedBankAccount.accountNumberDisplay;
          newBankAccount.name_on_check = `${costumer.firstName} ${costumer.lastName}`;
          newBankAccount.ach_account_type = this.firstCharToUpperCase(
            fetchedBankAccount.type,
          );

          newBankAccountsArray.push(newBankAccount);
        }

        await this.userBankAccountsRepository.save(newBankAccountsArray);
      }
    } catch (e) {
      this.logService.errorLogs(loanId, 'finicity: save accounts crash', JSON.stringify(e));
    }
  }

  async saveAggregatedAttributes(loanId: string) {
    const loan = await this.loanRepository.findOne({ id: loanId });
    const customer = await this.customerRepository.findOne({
      id: loan.customer_id,
    });
    const accountTypes = [AccountType.checking, AccountType.savings];
    const accounts = await this.userBankAccountsRepository
      .createQueryBuilder('uba')
      .where('uba.loan_id = :loanId', { loanId })
      .andWhere('uba.account_id IS NOT NULL')
      .andWhere('uba.ach_account_type IN(:...accountTypes)', {
        accountTypes,
      })
      .select('uba.account_id')
      .getMany();
    const accountIds = [...new Set(accounts.map(a => a.account_id))];
    const attributes = await this.finicityClient.getAggregatedAttributes(
      customer,
      accountIds,
    );

    const creditPull = new CreditPull();
    creditPull.file = JSON.stringify(attributes.data);
    creditPull.vendor = Vendors.finicity;
    creditPull.last_send_information = JSON.stringify({
      customer: customer.finicity_id,
      accountIds,
    });
    creditPull.loan_id = loanId;
    creditPull.last_response = attributes.statusText;
    return creditPull.save();
  }

  async finicityWebHook(loanId: string, body) {
    this.logService.addLogs(loanId, 'Finicity WebHook Data: ' + JSON.stringify(body));

    if (body?.eventType === 'added') {
      this.triggerJobs(loanId);
    }

    return Responses.success('Accepted');
  }

  private async triggerJobs(loanId) {
    try {
      if (await this.validateLoan(loanId) === false) {
        return;
      }

      // fetch from Finicity and store in DB user accounts
      await this.saveBankAccounts(loanId);

      // fetch aggregated data from finicity and store to DB
      await this.saveAggregatedAttributes(loanId);

      if (await this.validateLoan(loanId) === false) {
        return;
      }

      this.productService.underWriting(loanId);
    } catch (e) {
      this.logService.errorLogs(loanId, 'Jobs crash', JSON.stringify(e));
    }
  }

  private async validateLoan(loanId): Promise<boolean> {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    const statuses = [StatusFlags.waiting, StatusFlags.pending];

    return statuses.indexOf(loan.status_flag) !== -1
  }

  private firstCharToUpperCase = (stringItem: string) =>
    stringItem[0].toUpperCase() + stringItem.substring(1);
}
