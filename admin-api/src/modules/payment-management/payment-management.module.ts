import { Module } from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { PaymentManagementController } from './payment-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { HttpModule } from '@nestjs/common';
import { TransactionRepository } from 'src/repository/transaction.repository';
import { BankAccountsRepository } from 'src/repository/bankAccount.repository';
import { CustomerRepository } from 'src/repository/customer.repository';
import { UserRepository } from 'src/repository/users.repository';
import { BalanceStatementRepository } from '../../repository/balance-statement.repository';

@Module({
  controllers: [PaymentManagementController],
  providers: [PaymentManagementService],
  imports: [
    TypeOrmModule.forFeature([
      PaymentscheduleRepository,
      LoanRepository,
      TransactionRepository,
      BankAccountsRepository,
      CustomerRepository,
      UserRepository,
      BalanceStatementRepository,
    ]),
    HttpModule,
  ],
})
export class PaymentManagementModule {}
