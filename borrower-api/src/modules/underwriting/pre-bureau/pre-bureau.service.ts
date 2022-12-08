import { Injectable } from '@nestjs/common';
import { StatusFlags } from '../../../entities/loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../../repository/loan.repository';
import { FinicityMockService } from './finicity-mock.service';
import { CreditPullRepository } from '../../../repository/creditPull.repository';
import * as moment from 'moment';

@Injectable()
export class PreBureauService {
  constructor(
    private finicityMockService: FinicityMockService,
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    @InjectRepository(CreditPullRepository)
    private creditPullRepository: CreditPullRepository,
  ) {}

  getAverageBalanceFromFinicityReport(report) {
    const {
      assets: {
        customer: { monthlyAverageBalance },
      },
    } = report;
    let averageBalance = 0;

    Object.values(monthlyAverageBalance)
      .slice(-3)
      .map((balance: number) => (averageBalance += balance));

    if (averageBalance > 0) {
      averageBalance = Math.floor(averageBalance / 3);
    }

    return averageBalance;
  }

  getOverdraftsFromFinicityReport(report) {
    const {
      nsf: { monthlyNSFOccurrences },
    } = report;
    let overdrafts = 0;

    for (const [month, value] of Object.entries(monthlyNSFOccurrences)) {
      if (moment().diff(moment(month), 'M') < 4) {
        overdrafts += +value;
      }
    }

    return overdrafts;
  }

  async generalReport(loanId: string, customerId: string) {
    const settledOrChargedOffLoansCount = await this.loanRepository
      .createQueryBuilder('loan')
      .where(
        'loan.customer_id = :customerId AND (loan.status_flag = :status1 OR loan.status_flag = :status2)',
        {
          status1: StatusFlags.chargedOff,
          status2: StatusFlags.settled,
          customerId,
        },
      )
      .getCount();

    const lastDeclinedLoan = await this.loanRepository
      .createQueryBuilder('loan')
      .where(
        'loan.id != :loanId AND loan.customer_id = :customerId AND loan.status_flag = :status',
        { loanId, customerId, status: StatusFlags.cancelled },
      )
      .orderBy('loan.createdAt', 'DESC')
      .getOne();

    const pastDueLoan = await this.loanRepository.findOne({
      where: { status_flag: StatusFlags.pastDue, customer_id: customerId },
      order: {
        createdAt: 'DESC',
      },
    });

    const finicityAggregatedReport = await this.creditPullRepository.findOne({
      where: { loan_id: loanId },
      order: {
        created_at: 'DESC',
      },
      select: ['file'],
    });

    let averageBalance = 251;
    let numberOfOverdrafts = 0;
    const rule2Default = 7;
    const deniedLastInDays = 90;

    if (finicityAggregatedReport) {
      const { ca360_data } = JSON.parse(finicityAggregatedReport?.file);
      if (ca360_data) {
        averageBalance = this.getAverageBalanceFromFinicityReport(ca360_data);
        numberOfOverdrafts = this.getOverdraftsFromFinicityReport(ca360_data);
      }
    }

    const lastPastDue = pastDueLoan
      ? moment(pastDueLoan.createdAt).diff(moment(), 'M')
      : rule2Default;

    const lastDeclinedLoanDays = lastDeclinedLoan
      ? moment(lastDeclinedLoan.updatedAt).diff(moment(), 'days')
      : deniedLastInDays;

    return {
      settledOrChargedOffLoansCount,
      lastDeclinedLoanDays,
      lastPastDue,
      averageBalance,
      numberOfOverdrafts,
    };
  }
}
