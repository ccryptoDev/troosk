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

@Entity({ name: 'tblbankaccounts' })
export class BankAccounts extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  loan_id: string;

  @Column()
  headername: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  type: string;

  @Column({ default: null })
  subtype: string;

  @Column({ default: null })
  accountNumber: string;

  @Column({ default: null })
  routingNumber: string;

  @Column({ default: null })
  wire_routing: string;

  @Column({ default: null })
  institution_id: string;

  @Column({ type: 'float', default: null })
  available: number;

  @Column({ type: 'float' })
  current: number;

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
