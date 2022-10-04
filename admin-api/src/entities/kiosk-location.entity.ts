import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tblkiosklocations' })
export class KioskLocationEntity {
  @PrimaryGeneratedColumn()
  ref_no: number;

  @Column()
  @Generated('uuid')
  id: string;

  @Column({
    length: 4,
  })
  location_id: string;

  @Column()
  store_name: string;

  @Column()
  store_address: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  computer_details: string;

  @Column()
  server_details: string;

  @CreateDateColumn()
  purge_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
