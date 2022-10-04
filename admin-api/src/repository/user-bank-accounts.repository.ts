import { EntityRepository, Repository } from 'typeorm';
import { UserBankAccountsEntity } from '../entities/user-bank-accounts.entity';

@EntityRepository(UserBankAccountsEntity)
export class UserBankAccountsRepository extends Repository<
  UserBankAccountsEntity
> {}
