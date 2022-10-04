import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tblaggrement' })
export class aggrementEnity extends BaseEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  orginalfileName: string;

  @Column()
  type: string;

  @Column()
  fileKey: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
