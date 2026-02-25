import { Repository } from 'typeorm';
import { EmiPayment } from './entities/emi-payment.entity';
import { Loan } from '../loan/entities/loan.entity';
export declare class EmiService {
    private emiRepo;
    private loanRepo;
    constructor(emiRepo: Repository<EmiPayment>, loanRepo: Repository<Loan>);
    payEmi(loanId: number, userId: number): Promise<any>;
    getEmiStatus(loanId: number): Promise<any>;
    getEmiHistory(loanId: number): Promise<any>;
}
