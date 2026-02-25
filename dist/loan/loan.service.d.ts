import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from '../user/user.entity';
export declare class LoanService {
    private loanRepo;
    private userRepo;
    constructor(loanRepo: Repository<Loan>, userRepo: Repository<User>);
    getLoanOffer(userId: number, requestedAmount: number): Promise<any>;
    getLoanHistory(userId: number): Promise<any>;
    getUnpaidLoans(): Promise<any>;
    getLoanReport(startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string): Promise<any>;
}
