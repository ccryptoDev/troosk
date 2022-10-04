import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBankAccountsRepository } from '../../repository/user-bank-accounts.repository';
import { Responses } from '../../common/responses';
import {
  Flags,
  UserBankAccountsEntity,
} from '../../entities/user-bank-accounts.entity';
import { FinicityService } from '../finicity/finicity.service';
import { RepayService } from '../repay/repay.service';
import { CustomerRepository } from '../../repository/customer.repository';
import { AccountType } from '../repay/dto/a-c-h-details.dto';
import { LoanRepository } from '../../repository/loan.repository';
import { AddBankDto } from './dto/add-bank.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserBankAccountsRepository)
    private readonly userBankAccountsRepository: UserBankAccountsRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    private readonly finicityService: FinicityService,
    private readonly repayService: RepayService,
  ) {}

  async getBankAccounts(loanId: string) {
    try {
      const bankAccounts = await this.userBankAccountsRepository.find({
        where: { loan_id: loanId },
      });
      if (!bankAccounts)
        return new BadRequestException('Bank Accounts not found');

      return bankAccounts;
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async removeBankAccount(loanId: string, refNo: string) {
    try {
      const bankAccount = await this.userBankAccountsRepository.update(
        { loan_id: loanId, ref_no: refNo },
        { delete_flag: Flags.Y },
      );
      if (!bankAccount.affected)
        return new BadRequestException('Bank Account was not found');

      return Responses.success(`Bank account was successfully deleted`);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async selectBankAccount(loanId: string, refNo: string) {
    try {
      const unselectedBankAccount = await this.userBankAccountsRepository.findOne(
        {
          where: {
            loan_id: loanId,
            active_flag: Flags.Y,
          },
        },
      );
      if (unselectedBankAccount) {
        unselectedBankAccount.active_flag = Flags.N;
        await unselectedBankAccount.save();
      }

      const bankAccount = await this.userBankAccountsRepository.findOne({
        where: { loan_id: loanId, ref_no: refNo },
      });
      if (!bankAccount)
        return new BadRequestException('Bank Account was not found');

      if (!bankAccount.repay_token) {
        const bankAccountDetails = await this.finicityService.getBankAccountDetails(
          loanId,
          bankAccount.account_id,
        );
        if (!bankAccountDetails)
          return new BadRequestException(
            'Bank Account Details from Finicity was not found',
          );

        const customer = await this.customerRepository.findOne({
          where: { loan_id: loanId },
        });
        if (!customer) return new BadRequestException('Customer was not found');

        const repayReq = await this.repayService.addACHAccount({
          customer_id: customer.id,
          name_on_check: bankAccount.name_on_check,
          ach_account_number: bankAccountDetails.realAccountNumber,
          email: customer.email,
          address_zip: customer.zipCode,
          ach_routing_number: bankAccountDetails.routingNumber,
          sec_code: 'TEL',
          ach_account_type: this.firstCharToUpperCase(
            bankAccount.ach_account_type,
          ) as AccountType,
        });
        if (!repayReq.data)
          return new BadRequestException('Repay request failed');
        bankAccount.repay_token = repayReq.data?.saved_payment_method.token;
      }

      bankAccount.active_flag = Flags.Y;
      const selectedBankAccount = await bankAccount.save();
      if (!selectedBankAccount)
        return new BadRequestException('Bank Account was not selected');

      const updatedLoan = await this.loanRepository.update(
        { id: loanId },
        { payment_method_id: bankAccount.id },
      );
      if (!updatedLoan.affected)
        return new BadRequestException('Payment method was not updated');

      return Responses.success(
        `Payment method ${selectedBankAccount.account_name} was successfully selected`,
      );
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async addBankAccount(loanId: string, addBankDto: AddBankDto) {
    const customer = await this.customerRepository.findOne({
      where: { loan_id: loanId },
    });
    if (!customer) return new BadRequestException('Customer was not found');

    const repayReq = await this.repayService.addACHAccount({
      customer_id: customer.id,
      name_on_check: addBankDto.holderName,
      ach_account_number: addBankDto.accountNumber,
      email: customer.email,
      address_zip: customer.zipCode,
      ach_routing_number: addBankDto.routingNumber,
      sec_code: 'TEL',
      ach_account_type: addBankDto.ach_account_type,
    });
    if (!repayReq.data) return new BadRequestException('Repay request failed');

    const newBankAccount = new UserBankAccountsEntity();
    newBankAccount.loan_id = loanId;
    newBankAccount.account_id = '';
    newBankAccount.account_name = addBankDto.bankName;
    newBankAccount.name_on_check = addBankDto.holderName;
    newBankAccount.ach_account_type = addBankDto.ach_account_type;
    newBankAccount.account_number = repayReq.data?.last4;
    newBankAccount.repay_token = repayReq.data?.saved_payment_method.token;
    const savedBankAccount = await newBankAccount.save();
    if (!savedBankAccount)
      return new BadRequestException('Bank Account was not added');

    return Responses.success(
      `Payment method ${savedBankAccount.account_name} was successfully added`,
      savedBankAccount,
    );
  }

  private firstCharToUpperCase = (stringItem: string) =>
    stringItem[0].toUpperCase() + stringItem.substring(1);
}
