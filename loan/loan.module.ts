import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './entities/loan.entity';
import { User } from '../user/user.entity';
import { EmiPayment } from '../emi/entities/emi-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, User, EmiPayment])],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}