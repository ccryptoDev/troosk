import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { UpdateuserloanService } from './updateuserloan.service';
import { UpdateuserloanController } from './updateuserloan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { UserRepository } from '../../repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';
import { FinicityClient } from '../finicity/finicity.client';
import { LogService } from '../../common/log.service';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';
import { LogRepository } from '../../repository/log.repository';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserRepository,
      LoanRepository,
      LogRepository,
      UserBankAccountRepository,
    ]),
  ],
  controllers: [UpdateuserloanController],
  providers: [UpdateuserloanService, FinicityClient, LogService],
  exports: [UpdateuserloanService]
})
export class UpdateuserloanModule {}
