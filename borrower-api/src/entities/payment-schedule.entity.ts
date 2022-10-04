import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export enum StatusFlags {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

@Entity({ name: 'tblpaymentschedule' })
export class PaymentScheduleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10, default: null })
  loan_id: string;

  @Column({ type: 'float', default: null })
  unpaidPrincipal: number;

  @Column({ type: 'float' })
  principal: number;

  @Column({ type: 'float' })
  interest: number;

  @Column({ type: 'float' })
  fees: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'date' })
  scheduleDate: string;

  @Column({
    type: 'enum',
    enum: StatusFlags,
    default: StatusFlags.UNPAID,
  })
  status_flag: StatusFlags;

  @Column({ type: 'date', default: null })
  paidAt: string;

  @Column({ type: 'uuid', default: null })
  bankAccount: string;

  @Column({ default: null })
  TransactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
