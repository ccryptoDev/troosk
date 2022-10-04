import { EntityRepository, Repository } from 'typeorm';
import { PaymentScheduleEntity } from '../entities/paymentschedule.entity';

@EntityRepository(PaymentScheduleEntity)
export class PaymentscheduleRepository extends Repository<
  PaymentScheduleEntity
> {}
