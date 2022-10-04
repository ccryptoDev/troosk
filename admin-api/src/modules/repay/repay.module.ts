import { HttpModule, Module } from '@nestjs/common';
import { RepayService } from './repay.service';
import { RepayController } from './repay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { CustomerRepository } from '../../repository/customer.repository';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      PaymentscheduleRepository,
      LoanRepository,
      CustomerRepository,
    ]),
  ],
  providers: [RepayService],
  controllers: [RepayController],
  exports: [RepayService],
})
export class RepayModule {}
