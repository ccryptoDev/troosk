import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

export enum UsersRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  INSTALLER = 'installer',
}

@Entity({ name: 'tbluser' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ default: null })
  email: string;

  @Column()
  firstName: string;

  @Column({ default: null })
  middleName: string;

  @Column({ default: null })
  identificationNumber: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  salt: string;

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
  emailVerify: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  active_flag: Flags;

  @Column({ default: 0 })
  role: number;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  twoFactorAuth: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}
