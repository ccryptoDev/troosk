import { Module } from '@nestjs/common';
import { LoanContractController } from './loan-contract.controller';
import { LoanContractService } from './loan-contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { PaymentScheduleRepository } from '../../repository/payment-schedule.repository';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';
import { PaymentScheduleModule } from '../payment-schedule/payment-schedule.module';
import { FinicityModule } from '../finicity/finicity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserBankAccountRepository,
      LoanRepository,
      PaymentScheduleRepository,
    ]),
    PaymentScheduleModule,
    FinicityModule,
  ],
  controllers: [LoanContractController],
  providers: [LoanContractService],
})
export class LoanContractModule {}
