import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmiPayment } from './entities/emi-payment.entity';
import { Loan } from '../loan/entities/loan.entity';

@Injectable()
export class EmiService {
  constructor(
    @InjectRepository(EmiPayment)
    private emiRepo: Repository<EmiPayment>,
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
  ) {}

  async payEmi(loanId: number, userId: number): Promise<any> {
    const loan = await this.loanRepo.findOne({
      where: { id: parseInt(String(loanId)) },
    });

    if (!loan) {
      throw new HttpException(
        'Loan not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    if (loan.status === 'completed') {
      throw new HttpException(
        'Loan already completed',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    if (loan.status === 'defaulted') {
      throw new HttpException(
        'Loan defaulted',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    //counting paid emi
    
    const paidEmis = await this.emiRepo.find({
      where: { loanId: parseInt(String(loanId)) },
    });

    const paidCount = paidEmis.filter(
      e => e.status === 'paid' || e.status === 'delayed',
    ).length;

    if (paidCount >= loan.emiCount) {
      throw new HttpException(
        'All EMIs already paid',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    const emiNumber = paidCount + 1;

    //loan time

    const loanCreatedAt = new Date(loan.createdAt);
    const dueDate = new Date(loanCreatedAt);
    dueDate.setMonth(dueDate.getMonth() + emiNumber);

    const today = new Date();

    const isDelayed = today > dueDate;
    const penaltyAmount = isDelayed
      ? parseFloat((loan.emiAmount * 0.02).toFixed(2))
      : 0;

    const totalPaid = parseFloat(
      (Number(loan.emiAmount) + penaltyAmount).toFixed(2),
    );

    const emiStatus = isDelayed ? 'delayed' : 'paid';

    const emi = this.emiRepo.create({
      loanId: parseInt(String(loanId)),
      userId: parseInt(String(userId)),
      emiNumber,
      emiAmount: loan.emiAmount,
      penaltyAmount,
      totalPaid,
      dueDate,
      paidDate: today,
      status: emiStatus,
    });

    await this.emiRepo.save(emi);

    if (emiNumber === loan.emiCount) {
      loan.status = 'completed';
      await this.loanRepo.save(loan);
    }

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: `EMI ${emiNumber} paid successfully`,
      data: {
        emiNumber,
        emiAmount: loan.emiAmount,
        penaltyAmount,
        totalPaid,
        dueDate,
        paidDate: today,
        status: emiStatus,
        loanStatus: emiNumber === loan.emiCount ? 'completed' : 'active',
      },
    };
  }

  //emi status 

  async getEmiStatus(loanId: number): Promise<any> {
    const loan = await this.loanRepo.findOne({
      where: { id: parseInt(String(loanId)) },
    });

    if (!loan) {
      throw new HttpException(
        'Loan not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    const emis = await this.emiRepo.find({
      where: { loanId: parseInt(String(loanId)) },
    });

//counting time of loan and emi count

    const paidCount = emis.filter(
      e => e.status === 'paid' || e.status === 'delayed',
    ).length;

    const remainingEmis = loan.emiCount - paidCount;

    const loanCreatedAt = new Date(loan.createdAt);
    const nextDueDate = new Date(loanCreatedAt);
    nextDueDate.setMonth(nextDueDate.getMonth() + paidCount + 1);

    const loanEndDate = new Date(loanCreatedAt);
    loanEndDate.setMonth(loanEndDate.getMonth() + loan.emiCount);

    const today = new Date();
    const timeLeft = Math.ceil(
      (loanEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (today > loanEndDate && loan.status !== 'completed') {
      loan.status = 'defaulted';
      await this.loanRepo.save(loan);
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: timeLeft <= 0 ? 'Loan time finished' : `${timeLeft} days left`,
      data: {
        loanId,
        loanStatus: loan.status,
        totalEmis: loan.emiCount,
        paidEmis: paidCount,
        remainingEmis,
        emiAmount: loan.emiAmount,
        nextDueDate: remainingEmis > 0 ? nextDueDate : null,
        loanEndDate,
        daysLeft: timeLeft > 0 ? timeLeft : 0,
      },
    };
  }

  //emi history

  async getEmiHistory(loanId: number): Promise<any> {
    const emis = await this.emiRepo.find({
      where: { loanId: parseInt(String(loanId)) },
    });

    if (!emis || emis.length === 0) {
      throw new HttpException(
        'No EMI history found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'EMI history fetched successfully',
      data: {
        loanId,
        totalEmis: emis.length,
        emis,
      },
    };
  }
}


