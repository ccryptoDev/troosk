import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ACHDetailsDto } from './dto/a-c-h-details.dto';
import { RepayClient } from './repay-client';
import { Responses } from '../../common/responses';
import { CardDetailsDto } from './dto/card-details.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { StatusFlags } from '../../entities/paymentschedule.entity';
import { LessThanOrEqual } from 'typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { CommonLogger } from '../../common/logger/common-logger';

@Injectable()
export class RepayService {
  // todo refactor
  repayClient: RepayClient;
  logger = new CommonLogger();

  constructor(
    private http: HttpService,
    @InjectRepository(PaymentscheduleRepository)
    private readonly paymentScheduleRepository: PaymentscheduleRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {
    this.repayClient = new RepayClient(this.http);
  }

  async addACHAccount(ACHDetails: ACHDetailsDto) {
    try {
      const response = await this.repayClient.addACHAccount(ACHDetails);

      if (!this.repayClient.isSuccess(response)) {
        return Responses.validationError(
          'There is an error when we tried to proceed with your payment method. Please try another one or contact you bank for more details',
        );
      }

      return Responses.success('ACH account successfully added', response.data);
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async addCard(cardDetailsDto: CardDetailsDto) {
    try {
      const response = await this.repayClient.addCard(cardDetailsDto);

      if (this.repayClient.isSuccess(response)) {
        return Responses.validationError(
          'There is an error when we tried to proceed with your payment method. Please try another one or contact you bank for more details',
        );
      }

      return Responses.success('Card successfully added', response.data);
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async getPaymentMethods(id) {
    const response = await this.repayClient.paymentMethods(id);

    return response.data;
  }

  async makePayment(paymentDetails) {
    try {
      const response = await this.repayClient.makePayment(paymentDetails);

      if (this.repayClient.isSuccess(response)) {
        return Responses.validationError(
          'There is an error when we tried to proceed with your payment method. Please try another one or contact you bank for more details',
        );
      }

      return Responses.success('Payment Successfully Done', response.data);
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async makeSchedulePayment(paymentDetails) {
    try {
      const response = await this.repayClient.makeSchedulePayment(
        paymentDetails,
      );

      if (!this.repayClient.isSuccess(response)) {
        return Responses.validationError(
          'There is an error when we tried to proceed with your payment method. Please try another one or contact you bank for more details',
        );
      }

      return Responses.success('Payment Successfully Done', response.data);
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async paymentDisbursement(paymentDetails) {
    try {
      const response = await this.repayClient.ACHInstantDisbursement(
        paymentDetails,
      );

      if (this.repayClient.isSuccess(response)) {
        return Responses.validationError(
          'There is an error when we tried to proceed with your payment method. Please try another one or contact you bank for more details',
        );
      }

      return Responses.success('Founding Successful', response.data);
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async makeAutomaticPayment() {
    const today: Date = moment()
      .startOf('day')
      .toDate();

    try {
      const unpaidPayments = await this.paymentScheduleRepository.find({
        where: {
          scheduleDate: LessThanOrEqual(today),
          status_flag: StatusFlags.UNPAID,
        },
      });

      for (const unpaidPayment of unpaidPayments) {
        try {
          const { loan_id: loanId } = unpaidPayment;
          const loan = await this.loanRepository.findOne({
            where: { id: loanId },
            select: ['payment_method_id'],
          });

          const customer = await this.customerRepository.findOne({
            where: { loan_id: loanId },
            select: ['email'],
          });

          const payment = await this.makePayment({
            ach_token: loan.payment_method_id,
            amount: unpaidPayment.amount,
            sec_code: 'TEL',
            email: customer.email,
          });

          if (payment?.data) {
            unpaidPayment.status_flag = StatusFlags.PAID;
            unpaidPayment.paidAt = new Date().toDateString();
            unpaidPayment.TransactionId = 'TransactionId'; // TODO: Change! Where to take ?
            await unpaidPayment.save();
            this.logger.log(`Successful payment for loanId ${loanId}`);
          }
        } catch (e) {
          return new InternalServerErrorException(e);
        }
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
