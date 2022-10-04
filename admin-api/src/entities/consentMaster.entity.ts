import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tblconsentmaster' })
export class ConsentMasterEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_consent: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  fileName: string;

  @PrimaryGeneratedColumn()
  fileKey: number;

  @Column({ default: null })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
