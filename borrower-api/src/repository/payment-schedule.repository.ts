import { EntityRepository, Repository } from 'typeorm';
import { PaymentScheduleEntity } from '../entities/payment-schedule.entity';

@EntityRepository(PaymentScheduleEntity)
export class PaymentScheduleRepository extends Repository<
  PaymentScheduleEntity
> {}
