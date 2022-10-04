import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import * as moment from 'moment';
import { PaymentScheduleRepository } from '../../repository/payment-schedule.repository';
import { PaymentScheduleEntity } from '../../entities/payment-schedule.entity';
import { Responses } from '../../common/responses';

export interface PaymentScheduleItem {
  paymentDueDate: string;
  scheduledPayment: number;
  principal: number;
  interest: number;
  endingBalance: number;
}

@Injectable()
export class PaymentScheduleService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(PaymentScheduleRepository)
    private readonly paymentScheduleRepository: PaymentScheduleRepository,
  ) {}

  async getPaymentSchedule(loanId: string) {
    const schedule = await this.paymentScheduleRepository.find({
      where: { loan_id: loanId },
      order: { scheduleDate: 'ASC' },
    });
    if (!schedule) throw new NotFoundException('Schedule was not found');

    return Responses.success('Success', schedule);
  }

  async createPaymentSchedule(loanId: string) {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });
    if (!loan) return new NotFoundException('Loan was not found');
    const { createdAt, actualLoanAmount, actualLoanTerm, apr } = loan;

    const generatedSchedule = this.generateSchedule(
      createdAt,
      actualLoanAmount,
      actualLoanTerm,
      apr,
    );

    const existingSchedule = await this.paymentScheduleRepository.find({
      where: { loan_id: loanId },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!existingSchedule.length) {
      generatedSchedule.paymentSchedule.map(
        async (payment: PaymentScheduleItem) => {
          const scheduledPaymentEntity = new PaymentScheduleEntity();
          scheduledPaymentEntity.scheduleDate = payment.paymentDueDate;
          scheduledPaymentEntity.amount = payment.endingBalance;
          scheduledPaymentEntity.fees = payment.scheduledPayment;
          scheduledPaymentEntity.principal = payment.principal;
          scheduledPaymentEntity.interest = payment.interest;
          scheduledPaymentEntity.loan_id = loanId;

          try {
            await scheduledPaymentEntity.save();
          } catch (e) {
            throw new BadRequestException(e);
          }
        },
      );

      loan.financeCharge = generatedSchedule.totalInterest;
      loan.monthlyPayment = generatedSchedule.monthlyPayment;
      try {
        await loan.save();
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    return generatedSchedule;
  }

  private generateSchedule(
    date: Date,
    loanAmount: number,
    loanTerm: number,
    apr: number,
  ) {
    const paymentSchedule: PaymentScheduleItem[] = [];
    const monthlyApr = this.float(apr / 100 / 12, 7);
    const scheduledPayment = this.float(
      this.calcMonthlyPayment(loanAmount, loanTerm, monthlyApr),
    );
    let endingBalance = loanAmount;

    let totalPrincipal = 0;
    let totalInterest = 0;

    for (let month = 1; month <= loanTerm; month++) {
      const paymentDueDate = moment(date)
        .add(month, 'M')
        .format('MM/DD/YYYY');
      const interest = this.float(endingBalance * monthlyApr);
      const principal = this.float(scheduledPayment - interest);
      endingBalance = this.float(endingBalance - principal);

      totalPrincipal = this.float(totalPrincipal + principal);
      totalInterest = this.float(totalInterest + interest);

      const paymentScheduleItem: PaymentScheduleItem = {
        paymentDueDate,
        scheduledPayment,
        principal,
        interest,
        endingBalance: endingBalance >= 0 ? endingBalance : 0,
      };

      paymentSchedule.push(paymentScheduleItem);
    }

    return {
      totalPayment: totalPrincipal + totalInterest,
      totalPrincipal,
      totalInterest,
      monthlyPayment: scheduledPayment,
      paymentSchedule,
    };
  }

  // Formula to calculate monthly loan payment
  private calcMonthlyPayment = (
    loanAmount: number,
    loanTerm: number,
    monthlyApr: number,
  ) =>
    loanAmount *
    ((monthlyApr * Math.pow(1 + monthlyApr, loanTerm)) /
      (Math.pow(1 + monthlyApr, loanTerm) - 1));

  private float = (value: number, precision = 2) => +value.toFixed(precision);
}
