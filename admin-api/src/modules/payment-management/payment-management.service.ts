import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { Flags, StatusFlags } from '../../entities/loan.entity';
import { LoanRepository } from '../../repository/loan.repository';
import { BankAccountsRepository } from 'src/repository/bankAccount.repository';
import { CustomerRepository } from 'src/repository/customer.repository';
import { UserRepository } from 'src/repository/users.repository';
import { BalanceStatement } from 'src/entities/balanceStatement.entity';
import { Responses } from '../../common/responses';
import { MakePaymentDTO } from './dto/make-payment.dto';
import { method } from '../../entities/transaction.entity';
import moment from 'moment';
import { BalanceStatementRepository } from '../../repository/balance-statement.repository';
import { TransactionRepository } from '../../repository/transaction.repository';

@Injectable()
export class PaymentManagementService {
  constructor(
    @InjectRepository(PaymentscheduleRepository)
    private readonly paymentScheduleRepository: PaymentscheduleRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    @InjectRepository(BankAccountsRepository)
    private readonly bankAccountsRepository: BankAccountsRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(BalanceStatementRepository)
    private readonly balanceStatementRepository: BalanceStatementRepository,
    private httpService: HttpService,
  ) {}

  async makePayment(loanId, paymentDto: MakePaymentDTO, req) {
    /** todo clarify whether this comment represent correct info
     * 1. Calculate accrued interest till current date (for next unpaid pricipal)
     * 2. (Add accrued interest and unpaid principal balance) then - (payoff amount)
     * 3. Calculate new interest till next payment date (new unpaid principal)
     * 4. Add that interest to unpaid principal balance
     * 5. Regenerate rest of the payment schedule from next payment date
     * 6. Above steps are no longer applicable
     */

    // validation
    const paymentProcess = await this.paymentProcessValidation(
      loanId,
      paymentDto,
    );
    if (paymentProcess.statusCode !== HttpStatus.OK) {
      return paymentProcess;
    }

    try {
      // Get bank account
      const bankAc = await this.bankAccountsRepository.findOne({
        where: { loan_id: loanId, default: Flags.Y },
      });
      if (!bankAc) {
        return Responses.validationError('No Default Bank Account Exist!');
      }

      const operator = await this.userRepository.findOne({
        where: { email: req.user.email },
      });
      // Loan & Customer Data
      const loanData = await this.loanRepository.findOne({
        where: { id: loanId },
      });
      const customer = await this.customerRepository.findOne({
        where: { id: loanData.customer_id },
      });
      const lastStatement = await this.balanceStatementRepository.findOne({
        where: { loan_id: loanId },
        order: { ref_no: 'DESC' },
      });

      /**
       * Either interest or accrued interest will be 0 at given time
       */
      const interest = Number(lastStatement.interest);
      let unpaidInterest = Number(lastStatement.unpaid_interest);
      let unpaidFees = Number(lastStatement.unpaid_fees);
      let unpaidPrincipal = Number(lastStatement.unpaid_principal);
      const balance = Number(lastStatement.balance);
      const totalUnpaidBalance = Number(balance + interest);
      const totalAmount = Number((balance + interest).toFixed(2));

      if (totalAmount === 0) {
        return Responses.validationError('This loan is paid off');
      } else if (paymentDto.amount > totalAmount) {
        return Responses.validationError('Amount is higher than debt');
      }

      /**
       * Hierarchy of payment priority
       * 1. Interest
       * 2. Fees
       * 3. Principal
       */
      let paidInterest;
      let paidFees;
      let paidPrincipal;
      const availableAmt = paymentDto.amount;

      if (unpaidInterest >= availableAmt) {
        paidInterest = availableAmt;
        unpaidInterest = unpaidInterest - availableAmt;
      } else {
        paidInterest = unpaidInterest;
        unpaidInterest = 0;
      }

      if (unpaidFees >= availableAmt) {
        paidFees = availableAmt;
        unpaidFees = unpaidFees - availableAmt;
      } else {
        paidFees = unpaidFees;
        unpaidFees = 0;
      }

      if (unpaidPrincipal >= availableAmt) {
        paidPrincipal = availableAmt;
        unpaidPrincipal = unpaidPrincipal - availableAmt;
      } else {
        paidPrincipal = unpaidPrincipal;
        unpaidPrincipal = 0;
      }

      // Make payment
      const payload = {
        amount: paymentDto.amount,
        convenience_amount: 0,
        check_type: 'PERSONAL',
        account_number: '' + bankAc.accountNumber,
        transit_number: '' + bankAc.routingNumber,
        account_type: 'CHECKING',
        sec_code: 'TEL',
        name_on_check: customer.fullName,
        customer_id: 'LON_' + loanData.ref_no,
        phone_number: customer.phone,
        email: customer.email,
        force_duplicate: true,
        invoice_duplicate: true,
      };

      const response = await this.httpService
        .post(`${process.env.REPAY_ENDPOINT}transactions/ach/sale`, payload, {
          headers: {
            'rg-api-secure-token': process.env.REPAY_SECURE_TOKEN,
            'rg-api-user': process.env.REPAY_USERNAME,
          },
        })
        .toPromise();

      const data = response.data;

      // Save transaction
      const inserted = await this.transactionRepository.insert({
        loan_id: loanId,
        amount: data.amount || data.auth_amount,
        status: data.status || data.result_text,
        date: moment().format(moment.HTML5_FMT.DATE),
        repayPaymentType: data.trans_type_id,
        transactionId: data.transaction_id,
        merchantId: data.merchant_id,
        merchantName: data.merchant_name,
        secCode: data.sec_code || null,
        links: data.links,
        effectiveDate: data.effective_date || null,
        account_id: bankAc.id,
        accountMethod: method.ACH,
        // initiated_by: 'Operator', todo add
        // operator: operator.id, todo add
        payStatus: 'Paid on Time',
        repay_data: data,
      });

      const statement = new BalanceStatement();
      statement.cust_debit = Number(data.amount || data.auth_amount);
      statement.balance = Number(
        totalUnpaidBalance - Number(data.amount || data.auth_amount),
      );
      statement.paid_interest = paidInterest;
      statement.paid_fees = paidFees;
      statement.paid_principal = paidPrincipal;
      statement.unpaid_fees = unpaidFees;
      statement.unpaid_interest = unpaidInterest;
      statement.unpaid_principal = unpaidPrincipal;
      statement.loan_id = loanId;
      statement.user_id = loanData.user_id;
      statement.transaction = `Payment outside schedule`;
      statement.transaction_type = 'Manual By Operator';
      statement.transaction_id = inserted.raw[0].id;
      statement.type = 'Payment';
      statement.date = new Date();
      statement.processed_date = moment().format(moment.HTML5_FMT.DATE);

      await this.balanceStatementRepository.save(statement);

      return Responses.success();
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async makePayOffPayment(loanId, req) {
    const statement = await this.balanceStatementRepository.findOne({
      where: { loan_id: loanId },
      order: { ref_no: 'DESC' },
    });

    const interest = Number(statement.interest);
    const balance = Number(statement.balance);
    const paymentDTO = new MakePaymentDTO();
    paymentDTO.amount = Number((balance + interest).toFixed(2));

    return await this.makePayment(loanId, paymentDTO, req);
  }

  async paymentProcessValidation(id, makePaymentDto: MakePaymentDTO) {
    const payAmount = Number(Number(makePaymentDto.amount).toFixed(2));
    if (isNaN(payAmount)) {
      return Responses.validationError('The payment amount is wrong');
    }

    try {
      const loan = this.loanRepository.findOne({
        where: {
          delete_flag: Flags.N,
          status_flag: StatusFlags.active,
          id,
        },
      });

      if (loan) {
        return {
          statusCode: HttpStatus.OK,
        };
      } else {
        return Responses.validationError('This Loan Id Not Exists');
      }
    } catch (error) {
      return Responses.fatalError(error);
    }
  }
}
