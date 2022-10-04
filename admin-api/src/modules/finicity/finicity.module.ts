import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { FinicityController } from './finicity.controller';
import { FinicityService } from './finicity.service';
import { FinicityClient } from './finicity.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UserBankAccountsRepository } from '../../repository/user-bank-accounts.repository';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      LoanRepository,
      UserBankAccountsRepository,
    ]),
    CacheModule.register(),
  ],
  controllers: [FinicityController],
  providers: [FinicityService, FinicityClient],
  exports: [FinicityService],
})
export class FinicityModule {}
