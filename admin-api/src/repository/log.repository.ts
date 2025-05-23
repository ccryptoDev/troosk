import { EntityRepository, Repository } from 'typeorm';
import { LogEntity } from '../entities/log.entity';

@EntityRepository(LogEntity)
export class LogRepository extends Repository<LogEntity> {}
