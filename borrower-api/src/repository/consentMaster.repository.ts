import { EntityRepository, Repository } from 'typeorm';
import { ConsentMasterEntity } from '../entities/consentMaster.entity';
@EntityRepository(ConsentMasterEntity)
export class ConsentMasterRepository extends Repository<ConsentMasterEntity> {}
