import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UpdateUserLoanAmount,
  UpdateCustomerDetails,
} from '../updateuserloan/dto/update-updateuserloan.dto';
import { CustomerRepository } from '../../repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { Flags, StatusFlags } from 'src/entities/loan.entity';
import { getManager } from 'typeorm';
import { Responses } from '../../common/responses';

@Injectable()
export class UpdateuserloanService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {}
  async editUserLoanAmountDetails(
    loanId,
    updateUserLoanAmount: UpdateUserLoanAmount,
  ) {
    try {
      await this.loanRepository.update(
        { id: loanId },
        {
          actualLoanAmount: updateUserLoanAmount.loanAmount,
          apr: updateUserLoanAmount.apr,
          actualLoanTerm: updateUserLoanAmount.duration,
        },
      );
      return Responses.success('Update user loan details successfully');
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async editCustomerDetails(
    loanId,
    updateCustomerDetails: UpdateCustomerDetails,
  ) {
    const entityManager = getManager();
    try {
      await this.customerRepository.update(
        { loan_id: loanId },
        {
          socialSecurityNumber: updateCustomerDetails.socialSecurityNumber,
          phone: updateCustomerDetails.mobilePhone,
          otherPhoneNo: updateCustomerDetails.otherPhoneNo,
          phoneConsentPolicy: updateCustomerDetails.phoneConsentPolicy,
          email: updateCustomerDetails.emailAddress,
        },
      );
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
          status_flag: StatusFlags.pending,
          active_flag: Flags.Y,
        },
      );
      return Responses.success('Customer Details Updated Successfully');
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
