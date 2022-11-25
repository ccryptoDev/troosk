import { Module } from '@nestjs/common';
import { ApprovedService } from './approved.service';
import { ApprovedController } from './approved.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { TransactionRepository } from '../../repository/transaction.repository';
import { BalanceStatementRepository } from '../../repository/balance-statement.repository';
import { HttpModule } from '@nestjs/axios';
import { BankAccountsRepository } from '../../repository/bankAccount.repository';
import { LogRepository } from '../../repository/log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      PaymentscheduleRepository,
      LoanRepository,
      TransactionRepository,
      BankAccountsRepository,
      BalanceStatementRepository,
      LogRepository,
    ]),
    HttpModule,
  ],
  controllers: [ApprovedController],
  providers: [ApprovedService],
})
export class ApprovedModule {}
