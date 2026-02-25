import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('loan')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  requestedAmount: number;

  @Column({ type: 'decimal' })
  approvedAmount: number;

  @Column()
  salary: number;

  @Column()
  interestRate: number;

  @Column()
  emiCount: number;

  @Column({ type: 'decimal' })
  emiAmount: number;

  @Column({ type: 'decimal' })
  totalRepayment: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}


