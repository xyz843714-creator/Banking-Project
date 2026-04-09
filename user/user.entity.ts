import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  mobileNumber: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiry: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable:true})
  companyName:string;

  @Column({ nullable: true })
  salary: number;

  @Column({ default: false })
  isEmploymentApproved: boolean;

  @Column({ nullable: true })
  name: string;
}
  
