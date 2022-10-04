import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { FinicityController } from './finicity.controller';
import { FinicityService } from './finicity.service';
import { FinicityClient } from './finicity.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';
import { LogService } from '../../common/log.service';
import { LogRepository } from '../../repository/log.repository';
import { ProductModule } from '../underwriting/product/product.module';
import { CreditPullRepository } from '../../repository/creditPull.repository';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      LoanRepository,
      UserBankAccountRepository,
      CreditPullRepository,
      LogRepository,
    ]),
    CacheModule.register(),
    ProductModule,
  ],
  exports: [FinicityClient],
  controllers: [FinicityController],
  providers: [FinicityService, FinicityClient, LogService],
})
export class FinicityModule {}
