import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bank {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobileNumber: string;

  @Column('decimal')
  amount: number;

  @Column()
  type: string; // credit / debit

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
