import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankAccountsRepository } from '../../repository/user-bank-accounts.repository';
import { RepayModule } from '../repay/repay.module';
import { FinicityModule } from '../finicity/finicity.module';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserBankAccountsRepository,
      CustomerRepository,
      LoanRepository,
    ]),
    RepayModule,
    FinicityModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
