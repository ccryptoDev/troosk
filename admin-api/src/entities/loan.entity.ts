import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import ShortUniqueId from 'short-unique-id';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

export enum StatusFlags {
  active = 'active',
  approved = 'approved',
  denied = 'denied',
  underwriting = 'underwriting',
  cancelled = 'cancelled',
  waiting = 'waiting',
  fundingcontract = 'fundingcontract',
  performingcontract = 'performingcontract',
  pending = 'pending',
  chargedOff = 'charged-off',
  settled = 'settled',
  pastDue = 'past-due',
}

export enum LoanPaymentFrequency {
  monthly = 'MONTHLY',
}

export enum Verify {
  pass = 'pass',
  fail = 'fail',
  warning = 'warning',
}

@Entity({ name: 'tblloan' })
export class Loan extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column({ length: 10, unique: true })
  id: string;

  @BeforeInsert()
  private beforeInsert() {
    this.id = new ShortUniqueId({ length: 10 })();
  }

  @Column({ type: 'uuid', default: null })
  user_id: string;

  @Column({ type: 'float', default: 0 })
  monthlyPayment: number;

  @Column({ default: null })
  status: string;

  @Column({ default: null })
  kiosk_id: string;

  @Column({ default: null })
  kiosk_state: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_flag: Flags;

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
  idCard_Verified: Flags;

  @Column({
    type: 'enum',
    enum: Verify,
    default: Verify.pass,
    name: 'verification_status',
  })
  verificationStatus: string;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  finicity_Verified: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  creditcard_Verified: Flags;

  @Column({ default: null })
  signature: string;

  @Column({ default: null })
  date: Date;

  @Column({ type: 'uuid', default: null })
  customer_id: string;

  @Column({ default: null })
  gender: string;

  @Column({ default: null })
  size: string;

  @Column({ default: null })
  lastScreen: string;

  @Column({ default: 3 })
  mobile_otp_attempts: number;

  @Column({ default: 3 })
  email_otp_attempts: number;

  @Column({ default: null, name: 'mailotpExpiry' })
  mailotpExpiry: number;

  @Column({ default: null, name: 'emailotp' })
  emailotp: number;

  @Column({ default: null, name: 'mobileotpExpiry' })
  mobileotpExpiry: number;

  @Column({ default: null, name: 'mobileotp' })
  mobileotp: number;

  @Column({ default: Flags.N })
  phoneVerified: Flags;

  @Column({
    type: 'enum',
    enum: StatusFlags,
    default: StatusFlags.waiting,
  })
  status_flag: StatusFlags;

  @Column({ default: null })
  disbursement_account_id: string;

  @Column({ default: null })
  payment_method_id: string;

  @Column({ default: null })
  employmentType: string;

  @Column({ type: 'float', default: 0 })
  annualIncome: number;

  @Column({ default: null })
  purposeOfLoan: string;

  @Column({ default: null })
  state: string;

  @Column({ default: null })
  funding: Flags | null;

  @Column({ type: 'float', default: null })
  apr: number;

  @Column({ type: 'float', default: 0, name: 'max_loan_amount' })
  maxLoanAmount: number;

  @Column({ type: 'float', default: 0, name: 'max_loan_amount_factor_a' })
  maxLoanAmountFactorA: number;

  @Column({ type: 'float', default: 0, name: 'max_loan_amount_factor_b' })
  maxLoanAmountFactorB: number;

  @Column({ type: 'float', default: 0, name: 'actual_loan_amount' })
  actualLoanAmount: number;

  @Column({ type: 'float', default: 0, name: 'finance_charge' })
  financeCharge: number;

  @Column({ type: 'float', default: null, name: 'actual_loan_term' })
  actualLoanTerm: number;

  @Column({ type: 'float', default: null, name: 'max_loan_term' })
  maxLoanTerm: number;

  @Column({ type: 'float', default: null, name: 'funding_amount_ach' })
  fundingAmountACH: number;

  @Column({ type: 'float', default: null, name: 'funding_amount_prepaid_card' })
  fundingAmountPrepaidCard: number;

  @Column({ default: null })
  payFrequency: string;

  @Column({ default: 1 })
  dayOfMonth: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
