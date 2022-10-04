import { Module } from '@nestjs/common';
import { PaymentScheduleService } from './payment-schedule.service';
import { PaymentScheduleController } from './payment-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanRepository, PaymentscheduleRepository]),
  ],
  providers: [PaymentScheduleService],
  controllers: [PaymentScheduleController],
})
export class PaymentScheduleModule {}
