import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from '../user/user.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  //proccess of loan offer

  async getLoanOffer(userId: number, requestedAmount: number): Promise<any> {
    const parsedUserId = parseInt(String(userId));
    const parsedAmount = parseInt(String(requestedAmount));

    const user = await this.userRepo.findOne({
      where: { id: parsedUserId }
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.isEmploymentApproved) {
      throw new BadRequestException('User employment not approved yet');
    }

    const salary = user.salary;

    if (parsedAmount < 10000 || parsedAmount > 100000) {
      throw new BadRequestException('Loan amount must be between 10,000 and 1,00,000');
    }

    let approvedAmount: number;

    if (salary < 50000) {
      approvedAmount = salary * 0.25;
    } else {
      approvedAmount = parsedAmount;
    }

    const interestRate = 10;
    const emiCount = salary < 50000 ? 3 : 4;
    const totalInterest = (approvedAmount * interestRate) / 100;
    const totalRepayment = approvedAmount + totalInterest;
    const emiAmount = totalRepayment / emiCount;

    // Check if loan already exists for this user
    let loan = await this.loanRepo.findOne({
      where: { userId: parsedUserId }
    });

    if (loan) {
      // Update existing loan - same userId
      loan.requestedAmount = parsedAmount;
      loan.approvedAmount = approvedAmount;
      loan.salary = salary;
      loan.interestRate = interestRate;
      loan.emiCount = emiCount;
      loan.emiAmount = parseFloat(emiAmount.toFixed(2));
      loan.totalRepayment = parseFloat(totalRepayment.toFixed(2));
      loan.status = 'active';
    } else {
      // Create new loan - new userId
      loan = this.loanRepo.create({
        userId: parsedUserId,
        requestedAmount: parsedAmount,
        approvedAmount,
        salary,
        interestRate,
        emiCount,
        emiAmount: parseFloat(emiAmount.toFixed(2)),
        totalRepayment: parseFloat(totalRepayment.toFixed(2)),
        status: 'active',
      });
    }

    await this.loanRepo.save(loan);

    return {
      message: 'Loan offer generated successfully',
      data:{
      userId: parsedUserId,
      salary,
      requestedAmount: parsedAmount,
      approvedAmount,
      interestRate: `${interestRate}%`,
      emiCount,
      emiAmount: parseFloat(emiAmount.toFixed(2)),
      totalRepayment: parseFloat(totalRepayment.toFixed(2)),
      status: 'active',
      },
    };
  }

  async getLoanHistory(userId: number): Promise<any> {
    const loans = await this.loanRepo.find({
      where: { userId: parseInt(String(userId)) },
    });

    if (!loans || loans.length === 0) {
      throw new BadRequestException('No loan history found for this user');
    }

    return {
      message: 'Loan history fetched successfully',
      data:{
      userId,
      totalLoans: loans.length,
      loans,
      },
    };
  }

  async getUnpaidLoans():Promise<any> {
    const loans=await this.loanRepo.find({
      where: { status:'active'},
    });

    return{ 
      message:'Unpaid loans fetched successfully',
      data:{
      totalUnpaid:loans.length,
      loans,
      },
    };
  }

  //craeting report for loan

 async getLoanReport(
  startDate?: string,
  endDate?: string,
  name?: string,
  loanId?: number,
  mobileNumber?: string,
  status?: string,
): Promise<any> {
  const query = this.loanRepo
    .createQueryBuilder('loan')
    .leftJoin('user', 'user', 'user.id = loan.userId')
    .addSelect([
      'user.id',
      'user.name',
      'user.mobileNumber',                                                                                                                                                                                                                                                                           
    ]);

  if (startDate && endDate) {
    query.andWhere('loan.createdAt BETWEEN :startDate AND :endDate', {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  }

  if (loanId) {
    query.andWhere('loan.id = :loanId', { loanId });
  }

  if (status) {
    query.andWhere('loan.status = :status', { status });
  }

  if (name) {
    query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
  }

  if (mobileNumber) {
    query.andWhere('user.mobileNumber = :mobileNumber', { mobileNumber });
  }

  const loans = await query.getRawMany();

  if (!loans || loans.length === 0) {
    throw new BadRequestException('No loans found');
  }

  return {
    message: 'Loan report fetched successfully',
    data:{
    totalLoans: loans.length,
    loans,
    },
  };
 }
}