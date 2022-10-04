import { EntityRepository, Repository } from 'typeorm';
import { CustomerHistoryEntity } from '../entities/customer-history.entity';

@EntityRepository(CustomerHistoryEntity)
export class CustomerHistoryRepository extends Repository<
  CustomerHistoryEntity
> {}
