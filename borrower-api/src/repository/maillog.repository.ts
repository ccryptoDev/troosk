import { EntityRepository, Repository } from 'typeorm';
import { MaillogEntity } from '../entities/maillog.entity';

@EntityRepository(MaillogEntity)
export class MaillogRepository extends Repository<MaillogEntity> {}
