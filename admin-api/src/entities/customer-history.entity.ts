import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { EmployerLanguage, IdCardType } from './customer.entity';

@Entity({ name: 'tblcustomerhistory' })
export class CustomerHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column({ type: 'uuid', default: null })
  customer_id: string;

  @Column({ default: null })
  finicity_id: string;

  @Column({ default: null })
  identificationNumber: string;

  @Column({ default: null })
  state_id_number: string;

  @Column({ default: null })
  email: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ default: null })
  socialSecurityNumber: string;

  @Column({ default: null })
  employmentType: string;

  @Column()
  birthday: string;

  @Column({ default: null })
  phone: string;

  @Column()
  streetAddress: string;

  @Column({ default: null, name: 'address_line_1' })
  addressLine1: string;

  @Column({ default: null })
  unit: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column({ length: 10, unique: true })
  loan_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: 0 })
  dayOfMonth: number;

  @Column({ default: null })
  password: string;

  @Column({
    type: 'enum',
    enum: EmployerLanguage,
    default: EmployerLanguage.ENGLISH,
  })
  spokenLanguage: EmployerLanguage;

  @Column({ default: null })
  phoneConsentPolicy: string;

  @Column({ default: false })
  otherPhoneNo: string;

  @Column({
    type: 'enum',
    default: null,
    enum: IdCardType,
    name: 'id_card_type',
  })
  idCardType: IdCardType;

  @Column({ default: null, name: 'id_card_date_of_issue' })
  idCardDateOfIssue: Date;

  @Column({ default: null, name: 'id_card_date_of_exp' })
  idCardDateOfExp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
