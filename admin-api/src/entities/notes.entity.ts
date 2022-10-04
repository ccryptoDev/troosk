import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

@Entity({ name: 'tblnotes' })
export class NotesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_consent: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  fileName: string;

  @PrimaryGeneratedColumn()
  fileKey: number;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
