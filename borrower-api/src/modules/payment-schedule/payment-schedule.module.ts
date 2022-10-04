import { Module } from '@nestjs/common';
import { PaymentScheduleService } from './payment-schedule.service';
import { PaymentScheduleController } from './payment-schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { PaymentScheduleRepository } from '../../repository/payment-schedule.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoanRepository, PaymentScheduleRepository]),
  ],
  providers: [PaymentScheduleService],
  controllers: [PaymentScheduleController],
  exports: [PaymentScheduleService],
})
export class PaymentScheduleModule {}
