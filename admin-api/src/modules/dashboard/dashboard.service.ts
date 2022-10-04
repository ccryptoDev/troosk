import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { Flags, StatusFlags } from '../../entities/loan.entity';
import { getManager } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {}

  async get() {
    const entityManager = getManager();
    const data: any = {};
    try {
      const rawData = await entityManager.query(
        // `select count(*) as count from tblloan t join tbluser t2 on t2.id = t.user_id  where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'waiting'`,
        // `select COUNT(*)  from tblloan t where status_flag  = 'waiting'`
        `select COUNT(*)  from tblloan t where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'pending'`,
      );
      data.waiting_application = rawData[0]['count'];
      console.log('Waiting Application', data.waiting_application);

      const rawData1 = await entityManager.query(
        // `select count(*) as count from tblloan t join tbluser t2 on t2.id = t.user_id  where t.delete_flag = 'N' and t.active_flag = 'N' and t.status_flag = 'waiting'`,
        `select COUNT(*)  from tblloan t where delete_flag = 'N' and active_flag = 'N' and status_flag = 'waiting'`,
      );
      data.incomplete_application = rawData1[0]['count'];
      //console.log(rawData[0]['count'])
      //data.incomplete_application = await this.loanRepository.count({where:{delete_flag:Flags.N,active_flag:Flags.N}})
      data.approved_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          active_flag: Flags.Y,
          status_flag: StatusFlags.approved,
        },
      });
      data.canceled_application = await this.loanRepository.count({
        where: {
          delete_flag: Flags.N,
          active_flag: Flags.Y,
          status_flag: StatusFlags.cancelled,
        },
      });
      //data.waiting_application = await this.loanRepository.count({where:{delete_flag:Flags.N,active_flag:Flags.Y,status_flag:StatusFlags.waiting}})

      return { statusCode: 200, data: data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
