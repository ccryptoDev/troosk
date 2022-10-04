import {
  Entity,
  Column,
  CreateDateColumn,
  BaseEntity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tblotp' })
export class OtpEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column()
  otp: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ default: null })
  checkTime: string;
}
