import { Injectable } from '@nestjs/common';
import { of } from 'rxjs';
import { StatusFlags } from '../../../entities/loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../../repository/loan.repository';
import { FinicityMockService } from './finicity-mock.service';
import { object } from 'twilio/lib/base/serialize';
import { CreditPull } from '../../../entities/creditPull.entity';
import { CreditPullRepository } from '../../../repository/creditPull.repository';
import { LogService } from '../../../common/log.service';

@Injectable()
export class PreBureauService {
  constructor(
    private finicityMockService: FinicityMockService,
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    @InjectRepository(CreditPullRepository)
    private creditPullRepository: CreditPullRepository,
    private logService: LogService,
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

    return averageBalance;
  }

  getOverdraftsFromFinicityReport(report) {
    const {
      assets: {
        customer: { monthlyDaysWithNegativeBalance },
      },
    } = report;
    let averageBalance = 0;

    Object.values(monthlyDaysWithNegativeBalance)
      .slice(-3)
      .map((balance: number) => (averageBalance += balance));

    return averageBalance;
  }

  async generalReport(requestId) {
    const settledOrChargedOffLoansCount = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.status_flag = :status', { status: StatusFlags.chargedOff })
      .orWhere('loan.status_flag = :status', { status: StatusFlags.settled })
      .getCount();
    const lastDeclinedLoan = await this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.status_flag = :status', { status: StatusFlags.cancelled })
      .orderBy('loan.createdAt', 'DESC')
      .getOne();

    const pastDueLoan = await this.loanRepository.findOne({
      where: { id: requestId, status_flag: StatusFlags.pastDue },
      order: {
        createdAt: 'DESC',
      },
    });

    const finicityAggregatedReport = await this.creditPullRepository.findOne({
      where: { loan_id: requestId },
      order: {
        created_at: 'DESC',
      },
      select: ['file'],
    });
    let averageBalance = 251;
    let numberOfOverdrafts = 0;

    if (finicityAggregatedReport) {
      const { ca360_data } = JSON.parse(finicityAggregatedReport?.file);
      if (ca360_data) {
        averageBalance = this.getAverageBalanceFromFinicityReport(ca360_data);
        numberOfOverdrafts = this.getOverdraftsFromFinicityReport(ca360_data);
      }
    }

    return {
      settledOrChargedOffLoansCount,
      lastDeclinedLoan,
      pastDueLoan,
      averageBalance,
      numberOfOverdrafts,
    };
  }
}
