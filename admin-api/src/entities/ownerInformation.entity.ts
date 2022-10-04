import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
@Entity({ name: 'tblownerinformation' })
export class OwnerInformation extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  owner: string;

  @Column({ length: 10 })
  loan_id: string;
}
