import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tbluserbankaccounts' })
export class UserBankAccountsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: string;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ length: 10 })
  loan_id: string;

  @Column({ default: null })
  account_id: string;

  @Column({ default: null })
  account_name: string;

  @Column({ default: null })
  name_on_check: string;

  @Column({ default: null })
  ach_account_type: string;

  @Column({ type: 'integer', default: null })
  account_number: string;

  @Column({ default: null })
  repay_token: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  active_flag: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_flag: Flags;

  @CreateDateColumn()
  createdAt: Date;
}
