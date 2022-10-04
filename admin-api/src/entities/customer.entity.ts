import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
  BeforeInsert,
} from 'typeorm';

export enum EmployerLanguage {
  ENGLISH = 'english',
  SPANISH = 'spanish',
}

export enum Flags {
  N = 'N',
  Y = 'Y',
}

export enum IdCardType {
  DRIVER_LICENSE = `driver's license`,
  STATE_ISSUED_ID = 'state issued id',
  OTHER = 'other',
}

@Entity({ name: 'tblcustomer' })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ default: null })
  finicity_id: string;

  @Column({ default: null })
  identificationNumber: string;

  @Column({ default: null })
  state_id_number: string;

  @BeforeInsert()
  private beforeInsert() {
    this.state_id_number = this.state + '-' + this.identificationNumber;
  }

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

  @Column({ default: null })
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

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
