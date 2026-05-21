import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from '../user/user.entity';
import { EmiPayment } from '../emi/entities/emi-payment.entity';

@Injectable()
export class LoanService {

  // date format helper
  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }



  private formatCurrency(amount: any): string {
    if (!amount) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  }

  constructor(
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(EmiPayment)
    private emiRepo: Repository<EmiPayment>,
  ) { }

  //loan offer process
  async getLoanOffer(userId: number, requestedAmount: number): Promise<any> {
    const parsedUserId = parseInt(String(userId));
    const parsedAmount = parseInt(String(requestedAmount));

    const user = await this.userRepo.findOne({
      where: { id: parsedUserId }
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.isEmploymentApproved) {
      throw new HttpException(
        'User employment not approved yet',
        HttpStatus.FORBIDDEN,
      );
    }

    const salary = user.salary;

    if (parsedAmount < 10000 || parsedAmount > 100000) {
      throw new HttpException(
        'Loan amount must be between 10,000 and 1,00,000',
        HttpStatus.BAD_REQUEST,
      );
    }

    let approvedAmount: number;
    if (salary <= 50000) {
      approvedAmount = salary * 0.25;
    } else {
      approvedAmount = parsedAmount;
    }

    const interestRate = 10;
    const emiCount = salary <= 50000 ? 3 : 4;
    const totalInterest = (approvedAmount * interestRate) / 100;
    const totalRepayment = approvedAmount + totalInterest;
    const emiAmount = totalRepayment / emiCount;

    let loan = await this.loanRepo.findOne({
      where: { userId: parsedUserId }
    });

    if (loan) {
      loan.requestedAmount = parsedAmount;
      loan.approvedAmount = approvedAmount;
      loan.salary = salary;
      loan.interestRate = interestRate;
      loan.emiCount = emiCount;
      loan.emiAmount = parseFloat(emiAmount.toFixed(2));
      loan.totalRepayment = parseFloat(totalRepayment.toFixed(2));
      loan.status = 'active';
    } else {
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
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Loan offer generated successfully',
      data: {
        userId: parsedUserId,
        salary: this.formatCurrency(salary),
        requestedAmount: this.formatCurrency(parsedAmount),
        approvedAmount: this.formatCurrency(approvedAmount),
        interestRate: `${interestRate}%`,
        emiCount,
        emiAmount: this.formatCurrency(parseFloat(emiAmount.toFixed(2))),
        totalRepayment: this.formatCurrency(parseFloat(totalRepayment.toFixed(2))),
        status: 'active',
      },
    };
  }

  //loan history
  async getLoanHistory(userId: number): Promise<any> {
    const loans = await this.loanRepo.find({
      where: { userId: parseInt(String(userId)) },
    });

    if (!loans || loans.length === 0) {
      throw new HttpException(
        'No loan history found for this user',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Loan history fetched successfully',
      data: {
        userId,
        totalLoans: loans.length,
        loans,
      },
    };
  }

  //unpaid loans
  async getUnpaidLoans(): Promise<any> {
    const loans = await this.loanRepo.find({
      where: { status: 'active' },
    });

    if (!loans || loans.length === 0) {
      throw new HttpException(
        'No unpaid loans found',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Unpaid loans fetched successfully',
      data: {
        totalUnpaid: loans.length,
        loans,
      },
    };
  }

  // loan report with pagination + all filters + emi due date
  async getLoanReport(
    page: number = 1,
    limit: number = 10,
    startDate?: string,
    endDate?: string,
    name?: string,
    loanId?: number,
    mobileNumber?: string,
    status?: string,
    emiId?: number,
    emiDueDate?: string,

  ): Promise<any> {
    const parsedPage = parseInt(String(page)) || 1;
    const parsedLimit = parseInt(String(limit)) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const query = this.loanRepo.createQueryBuilder('loan')
      .leftJoinAndSelect('loan.user', 'user') // ← auto selects all user columns!
      .orderBy('loan.createdAt', 'DESC');


    // Step 2: Apply filters
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

    if (emiId) {
      query.andWhere(
        'loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE id = :emiId)',
        { emiId }
      );
    }

    if (emiDueDate) {
      query.andWhere(
        'loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE DATE("dueDate") = :emiDueDate)',
        { emiDueDate }
      );
    }

    // Step 3: Get total count for pagination
    const totalLoans = await query.getCount();
    const totalPages = Math.ceil(totalLoans / parsedLimit);

    // Step 4: Apply pagination
    query.skip(skip).take(parsedLimit);

    const loans = await query.getMany();

    if (!loans || loans.length === 0) {
      throw new HttpException('No loans found', HttpStatus.NOT_FOUND);
    }

    // Step 5: For each loan fetch EMI details
    const loanWithEmis = await Promise.all(
      loans.map(async (loan) => {

        const emis = await this.emiRepo.find({
          where: { loanId: loan.id },
          order: { emiNumber: 'ASC' },
        });

        const emiDetails = emis.map((emi) => ({
          emiId: emi.id,
          emiNumber: emi.emiNumber,
          emiAmount: this.formatCurrency(emi.emiAmount),
          penaltyAmount: this.formatCurrency(emi.penaltyAmount),
          totalPaid: this.formatCurrency(emi.totalPaid),
          dueDate: this.formatDate(emi.dueDate),
          paidDate: this.formatDate(emi.paidDate),
          status: emi.status,
        }));

        return {
          loanId: loan.id,
          // ← user details from relation! 
          userId: loan.user?.id,
          userName: loan.user?.name,
          mobileNumber: loan.user?.mobileNumber,

          loanStatus: loan.status,
          requestedAmount: this.formatCurrency(loan.requestedAmount),
          approvedAmount: this.formatCurrency(loan.approvedAmount),
          salary: this.formatCurrency(loan.salary),
          interestRate: loan.interestRate,
          emiCount: loan.emiCount,
          emiAmount: this.formatCurrency(loan.emiAmount),
          totalRepayment: this.formatCurrency(loan.totalRepayment),
          loanCreatedAt: this.formatDate(loan.createdAt),

          emiDetails: {
            totalEmis: loan.emiCount,
            paidEmis: emiDetails.filter(
              e => e.status === 'paid' || e.status === 'delayed'
            ).length,
            pendingEmis: emiDetails.filter(
              e => e.status === 'pending'
            ).length,
            emis: emiDetails,
          },
        };
      })
    );

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Loan report fetched successfully',
      data: {
        totalLoans,
        totalPages,
        currentPage: parsedPage,
        limit: parsedLimit,
        loans: loanWithEmis,
      },
    };
  }

  // CSV report
  async getLoanReportCsv(
    startDate?: string,
    endDate?: string,
    name?: string,
    loanId?: number,
    mobileNumber?: string,
    status?: string,
    emiId?: number,
    emiDueDate?: string,
  ): Promise<string> {


    const report = await this.getLoanReport(
      1, 10000,  // get all records
      startDate, endDate, name, loanId,
      mobileNumber, status, emiId, emiDueDate,
    );

    const loans = report.data.loans;

    const q = (val: any): string => {
      if (val === null || val === undefined || val === '') return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const fmtNum = (val: any): string => {
      if (val === null || val === undefined || val === '') return '';
      const n = Number(String(val).replace(/,/g, ''));
      return isNaN(n) ? String(val) : String(n);
    };



    const csvHeaders = [
      'Loan ID',
      'User ID',
      'User Name',
      'Mobile Number',
      'Loan Status',
      'Requested Amount',
      'Approved Amount',
      'Salary',
      'Interest Rate',
      'EMI Count',
      'EMI Amount',
      'Total Repayment',
      'Loan Created At',
      'Total EMIs',
      'Paid EMIs',
      'Pending EMIs',
      'EMI ID',
      'EMI Number',
      'EMI Amount (EMI)',
      'Penalty Amount',
      'Total Paid',
      'Due Date',
      'Paid Date',
      'EMI Status',
    ].map(q).join(',');

    const csvRows: string[] = [];

    loans.forEach((loan: any) => {
      const loanCols = [
        q(loan.loanId),
        q(loan.userId),
        q(loan.userName),
        q(loan.mobileNumber),
        q(loan.loanStatus),
        q(fmtNum(loan.requestedAmount)),
        q(fmtNum(loan.approvedAmount)),
        q(fmtNum(loan.salary)),
        q(fmtNum(loan.interestRate)),
        q(fmtNum(loan.emiCount)),
        q(fmtNum(loan.emiAmount)),
        q(fmtNum(loan.totalRepayment)),
        q(loan.loanCreatedAt),
        q(loan.emiDetails.totalEmis),
        q(loan.emiDetails.paidEmis),
        q(loan.emiDetails.pendingEmis),
      ];

      if (!loan.emiDetails.emis || loan.emiDetails.emis.length === 0) {
        csvRows.push([
          ...loanCols,
          q(''), q(''), q(''), q(''), q(''), q(''), q(''), q(''),
        ].join(','));
      } else {
        loan.emiDetails.emis.forEach((emi: any) => {
          csvRows.push([
            ...loanCols,
            q(emi.emiId),
            q(emi.emiNumber),
            q(fmtNum(emi.emiAmount)),
            q(fmtNum(emi.penaltyAmount)),
            q(fmtNum(emi.totalPaid)),
            q(emi.dueDate),
            q(emi.paidDate),
            q(emi.status),
          ].join(','));
        });
      }
    });


    const SEP = 'sep=,';

    return [SEP, csvHeaders, ...csvRows].join('\n');
  }

  async getLoanSummary(userId: number): Promise<any> {
    const parsedUserId = parseInt(String(userId));
    const loans = await this.loanRepo.find({
      where: { userId: parsedUserId }
    });

    if (!loans || loans.length === 0) {
      throw new HttpException('no loans found for this user', HttpStatus.NOT_FOUND)
    }
    const activeLoans = loans.filter(
      loan => loan.status === 'active'
    ).length;
    const defaultedLoans = loans.filter(
      loan => loan.status === 'defaulted'
    ).length;
    const totalAmount = loans.reduce(
      (total, loan) => total + Number(loan.approvedAmount), 0
    );
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Loan summary fetched successfully',
      data: {
        userId: parsedUserId,
        totalLoans: loans.length,
        activeLoans,
        defaultedLoans,
        totalApprovedAmount: `₹${totalAmount.toLocaleString('en-IN')}`
      },
    };
  }
}








