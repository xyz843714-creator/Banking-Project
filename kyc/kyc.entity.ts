import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Kyc {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobileNumber: string;

  @Column()
  aadhaarNumber: string;

  @Column()
  panNumber: string;

  @Column({ default: 'pending' })
  status: string; // pending / approved / rejected
}
