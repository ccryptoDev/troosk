import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

export enum method {
  ACH = 'ACH',
  BANK = 'BankAccount',
}

export enum payment {
  Loan = 'Loan',
  Milestone1 = 'Milestone1',
  Milestone2 = 'Milestone2',
  Milestone3 = 'Milestone3',
}
@Entity({ name: 'tbltransaction' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: null })
  authCode: string;

  @Column({ default: null })
  message: string;

  @Column({ default: null })
  status: string;

  @Column()
  date: string;

  @Column({ default: null })
  repayPaymentType: string;

  @Column({ default: null })
  transactionId: string;

  @Column({ default: null })
  secCode: string;

  @Column({ default: null })
  merchantId: string;

  @Column({ default: null })
  merchantName: string;

  @Column('varchar', { array: true, default: null })
  links: string[];

  @Column({ default: null })
  effectiveDate: string;

  @Column({ default: null })
  payStatus: string;

  @Column({ default: null })
  repay_data: string;

  @Column({
    type: 'enum',
    enum: method,
    default: null,
  })
  accountMethod: method;

  @Column({
    type: 'enum',
    enum: payment,
    default: payment.Loan,
  })
  payment: payment;

  @Column({ type: 'uuid', default: null })
  account_id: string;

  @Column({ length: 10, default: null })
  loan_id: string;

  @Column({ default: null })
  amount: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_flag: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
