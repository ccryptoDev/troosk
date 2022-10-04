import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tblfaq' })
export class FaqEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_consent: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ default: null })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
