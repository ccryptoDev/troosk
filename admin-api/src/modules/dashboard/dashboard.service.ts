import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not } from 'typeorm';

import { LoanRepository } from '../../repository/loan.repository';
import { Flags, StatusFlags } from '../../entities/loan.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {}

  async get() {
    const data: any = {};
    try {
      data.waiting_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          status_flag: StatusFlags.pending,
          customer_id: Not(IsNull()),
          user_id: Not(IsNull()),
        },
      });
      data.incomplete_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          status_flag: StatusFlags.waiting,
          customer_id: Not(IsNull()),
          user_id: Not(IsNull()),
        },
      });
      data.approved_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          status_flag: StatusFlags.approved,
          customer_id: Not(IsNull()),
          user_id: Not(IsNull()),
        },
      });
      data.canceled_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          status_flag: StatusFlags.cancelled,
          customer_id: Not(IsNull()),
          user_id: Not(IsNull()),
        },
      });

      return { statusCode: HttpStatus.OK, data };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
