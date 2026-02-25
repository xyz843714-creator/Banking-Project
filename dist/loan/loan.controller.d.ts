import { LoanService } from './loan.service';
export declare class LoanController {
    private loanService;
    constructor(loanService: LoanService);
    getLoanOffer(userId: number, requestedAmount: number): Promise<any>;
    getLoanHistory(userId: number): Promise<any>;
    getUnpaidLoans(): Promise<any>;
    getLoanReport(startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string): Promise<any>;
}
