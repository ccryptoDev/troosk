import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export enum Vendors {
  finicity = 'F',
  transunion = 'T',
  test = 'test',
}

@Entity({ name: 'tblcreditpull' })
export class CreditPull extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  loan_id: string;

  @Column()
  vendor: Vendors;

  @Column({ default: null })
  last_response: string;

  @Column({ type: 'text' })
  file: string;

  @Column({ default: null })
  last_send_information: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
