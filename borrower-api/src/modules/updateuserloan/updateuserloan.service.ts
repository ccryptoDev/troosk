import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserLoanAmount } from './dto/updateUserloan.dto';
import { UpdateCustomerDetailsDto } from './dto/updateCustomerDetails.dto';
import { CustomerRepository } from '../../repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { getManager } from 'typeorm';
import { Responses } from '../../common/responses';
import { UpdateDisbursementAccountIdDto } from './dto/updateDisbursementAccountId.dto';
import { UpdatePaymentAccountIdDto } from './dto/updatePaymentAccountId.dto';
import { LastScreenModel } from '../../common/last-screen.model';
import { UserBankAccountsEntity } from '../../entities/user-bank-accounts.entity';
import { LogService } from '../../common/log.service';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';
import { RepayClient } from './repay-client';
import { SecCode } from './dto/retrieve.paytoken';
import { ACHDetailsDto } from './dto/a-c-h-details.dto';
import { FinicityClient } from '../finicity/finicity.client';
import { FinicityIdDto } from './dto/finicity-id.dto';

@Injectable()
export class UpdateuserloanService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    private logService: LogService,
    @InjectRepository(UserBankAccountRepository)
    private bank: UserBankAccountRepository,
    private finicityClient: FinicityClient,
    private http: HttpService,
  ) {}

  async editUserLoanAmountDetails(
    loanId: string,
    updateUserLoanAmount: UpdateUserLoanAmount,
  ) {
    try {
      const res = await this.loanRepository.update(
        { id: loanId },
        {
          actualLoanAmount: updateUserLoanAmount.loanAmount,
          actualLoanTerm: updateUserLoanAmount.duration,
        },
      );
      if (!res.affected) return { message: 'Loan not found' };

      return { statusCode: 200, data: 'Update user loan details successfully' };
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async editCustomerDetails(
    loanId: string,
    updateCustomerDetails: UpdateCustomerDetailsDto,
  ) {
    const entityManager = getManager();
    try {
      const fields: any = {
        socialSecurityNumber: updateCustomerDetails.socialSecurityNumber,
        phone: updateCustomerDetails.mobilePhone,
        otherPhoneNo: updateCustomerDetails.otherPhoneNo,
        phoneConsentPolicy: updateCustomerDetails.phoneConsentPolicy,
        email: updateCustomerDetails.emailAddress,
      };

      await this.customerRepository.update({ loan_id: loanId }, fields);
      const userID = await entityManager.query(
        `select user_id  from tblloan t where id = '${loanId}'`,
      );

      await this.userRepository.update(
        { id: userID[0].user_id },
        { email: updateCustomerDetails.emailAddress },
      );

      await this.loanRepository.update(
        { id: loanId },
        {
          employmentType: updateCustomerDetails.employmentType,
          annualIncome: updateCustomerDetails.annualIncome,
          purposeOfLoan: updateCustomerDetails.purposeOfLoan,
          lastScreen: LastScreenModel.CustomerLoanDetails,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        data: 'Customer and Loan details updated successfully!',
      };
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async editCustomerNameAndAddress(loanId: string, updateCustomerDetails) {
    try {
      await this.customerRepository.update(
        { loan_id: loanId },
        updateCustomerDetails,
      );

      return {
        statusCode: HttpStatus.OK,
        data: 'Customer details updated successfully!',
      };
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async editDisbursementAccountId(
    loanId: string,
    disbursementAccountIdDto: UpdateDisbursementAccountIdDto,
  ) {
    try {
      const updatedLoan = await this.loanRepository.update(
        { id: loanId },
        {
          disbursement_account_id:
            disbursementAccountIdDto.disbursementAccountId,
        },
      );

      try {
        const account = await this.bank.findOne({
          where: { account_id: disbursementAccountIdDto.disbursementAccountId },
        });
        if (!account.repay_token) {
          await this.activateACHAccount(loanId, account);
        }
      } catch (e) {
        this.logService.errorLogs(loanId, 'Error select payment method', e);
      }

      if (!updatedLoan.affected)
        return Responses.validationError(
          'Disbursement account id was not updated',
        );

      return Responses.success(
        'Disbursement account id was updated successfully!',
      );
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async activateACHAccount(loanId: string, account: UserBankAccountsEntity) {
    const loan = await this.loanRepository.findOne({ id: loanId });
    const customer = await this.customerRepository.findOne({
      id: loan.customer_id,
    });

    const bankCredentials = await this.finicityClient.getBankAccountDetails(
      customer.finicity_id,
      account.account_id,
    );

    const repay = new RepayClient(this.http);

    const details = {
      customer_id: loan.customer_id,
      ach_account_number: bankCredentials.realAccountNumber,
      ach_routing_number: bankCredentials.routingNumber,
      ach_account_type: account.ach_account_type,
      name_on_check: customer.fullName,
      sec_code: SecCode.customer,
    };

    const repayResponse = await repay.addACHAccount(details as ACHDetailsDto);

    account.repay_token = repayResponse.data?.saved_payment_method.token;

    return await account.save();
  }

  async editPaymentAccountId(
    loanId: string,
    paymentAccountIdDto: UpdatePaymentAccountIdDto,
  ) {
    try {
      const updatedLoan = await this.loanRepository.update(
        { id: loanId },
        { payment_method_id: paymentAccountIdDto.paymentAccountId },
      );

      try {
        const account = await this.bank.findOne({
          where: { account_id: paymentAccountIdDto.paymentAccountId },
        });

        if (!account.repay_token) {
          await this.activateACHAccount(loanId, account);
        }
      } catch (e) {
        this.logService.errorLogs(loanId, 'Error select payment method', e);
      }

      if (!updatedLoan.affected)
        return Responses.validationError('Payment account id was not updated');

      return Responses.success('Payment account id was updated successfully!');
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async setFinicityId(loanId: string, finicityData: FinicityIdDto) {
    const loan = await this.loanRepository.findOne({where: {id: loanId}});

    if (loan) {
      const customer = await this.customerRepository.findOne({where: { id: loan.customer_id }});
      if (customer) {
        customer.finicity_id = finicityData.finicityId;
        await customer.save();

        return Responses.success();
      }
    }

    return Responses.validationError('Fail');
  }
}
