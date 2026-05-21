import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from '../user/user.entity';
import { EmiPayment } from '../emi/entities/emi-payment.entity';
export declare class LoanService {
    private loanRepo;
    private userRepo;
    private emiRepo;
    private formatDate;
    private formatCurrency;
    constructor(loanRepo: Repository<Loan>, userRepo: Repository<User>, emiRepo: Repository<EmiPayment>);
    getLoanOffer(userId: number, requestedAmount: number): Promise<any>;
    getLoanHistory(userId: number): Promise<any>;
    getUnpaidLoans(): Promise<any>;
    getLoanReport(page?: number, limit?: number, startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string, emiId?: number, emiDueDate?: string): Promise<any>;
    getLoanReportCsv(startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string, emiId?: number, emiDueDate?: string): Promise<string>;
    getLoanSummary(userId: number): Promise<any>;
}
