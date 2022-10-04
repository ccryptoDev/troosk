import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tbluseruploaddocument' })
export class uploadUserDocument extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({ length: 10 })
  loan_id: string;

  @Column()
  fileName: string;

  @Column({ default: null })
  orginalfileName: string;

  @Column({ default: null })
  type: string;

  @Column({ default: null })
  exactFileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
