import { LoanService } from './loan.service';
import type { Response } from 'express';
export declare class LoanController {
    private loanService;
    constructor(loanService: LoanService);
    getLoanOffer(userId: number, requestedAmount: number): Promise<any>;
    getLoanHistory(userId: number): Promise<any>;
    getUnpaidLoans(): Promise<any>;
    getLoanReportCsv(res: Response, page?: number, limit?: number, startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string, emiId?: number, emiDueDate?: string): Promise<Response<any, Record<string, any>>>;
    getLoanReport(page?: number, limit?: number, startDate?: string, endDate?: string, name?: string, loanId?: number, mobileNumber?: string, status?: string, emiId?: number, emiDueDate?: string): Promise<any>;
}
