import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  salary: number;

  @Column()
 userMobile: string;
}

