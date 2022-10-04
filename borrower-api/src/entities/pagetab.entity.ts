import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tblpagetabs' })
export class Pagetabs extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pages_id: number;

  @Column()
  order_no: number;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.N,
  })
  delete_flag: Flags;

  @Column({
    type: 'enum',
    enum: Flags,
    default: Flags.Y,
  })
  active_flag: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
