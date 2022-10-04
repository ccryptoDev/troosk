import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tblbalancestatement' })
export class BalanceStatement extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ length: 10 })
  loan_id: string;

  @Column()
  date: Date;

  @Column()
  transaction: string;

  @Column({ default: 0, type: 'float' })
  days_of_interest: number;

  @Column({ default: 0, type: 'float' })
  interest: number;

  @Column({ default: null, type: 'uuid' })
  transaction_id: string;

  @Column({ default: null })
  transaction_type: string;

  @Column({ default: 0, type: 'float' })
  fees: number;

  @Column({ default: 0, type: 'float' })
  interest_accrued: number;

  @Column({ default: 0, type: 'float' })
  cust_debit: number;

  @Column({ default: 0, type: 'float' })
  credit: number;

  @Column({ default: 0, type: 'float' })
  paid_interest: number;

  @Column({ default: 0, type: 'float' })
  paid_fees: number;

  @Column({ default: 0, type: 'float' })
  paid_principal: number;

  @Column({ default: 0, type: 'float' })
  balance: number;

  @Column({ default: 0, type: 'float' })
  unpaid_interest: number;

  @Column({ default: 0, type: 'float' })
  unpaid_fees: number;

  @Column({ default: 0, type: 'float' })
  unpaid_principal: number;

  @Column()
  type: string;

  @Column({ default: null })
  reversal_code: string;

  @Column()
  processed_date: string;

  @Column({ default: null })
  interest_processed_date: string;

  @Column({ type: 'enum', enum: Flags, default: Flags.N })
  payment_processed: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
