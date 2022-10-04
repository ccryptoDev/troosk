import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tblmaillog' })
export class MaillogEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, default: null })
  loan_id: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  subject: string;

  @Column({ default: null })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
