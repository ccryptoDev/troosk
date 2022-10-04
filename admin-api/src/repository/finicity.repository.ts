import { EntityRepository, Repository } from 'typeorm';
import { FinicityEntity } from '../entities/finicity.entity';

@EntityRepository(FinicityEntity)
export class FinicityRepository extends Repository<FinicityEntity> {}
