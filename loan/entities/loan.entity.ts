import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/user.entity';

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

  // ← add createForeignKeyConstraints: false
@ManyToOne(() => User, { createForeignKeyConstraints: false })
@JoinColumn({ name: 'userId' })
user: User;
}


