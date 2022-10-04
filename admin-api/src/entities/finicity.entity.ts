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

@Entity({ name: 'tblfinicity' })
export class FinicityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10, default: null })
  loan_id: string;

  @Column({ default: null })
  finicity_token: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_Flag: string;

  @Column({ default: null })
  customerid: string;

  @Column({ default: null })
  consumerid: string;

  @Column({ default: null })
  url: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  username: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ default: null })
  birthday: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  streetAddress: string;

  @Column({ default: null })
  city: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  zipCode: string;

  @Column({ default: null })
  socialSecurityNumber: string;

  @Column({ default: null })
  suffix: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
