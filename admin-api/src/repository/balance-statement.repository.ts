import { BalanceStatement } from '../entities/balanceStatement.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BalanceStatement)
export class BalanceStatementRepository extends Repository<BalanceStatement> {}
