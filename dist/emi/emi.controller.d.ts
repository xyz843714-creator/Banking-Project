import { EmiService } from './emi.service';
export declare class EmiController {
    private emiService;
    constructor(emiService: EmiService);
    payEmi(loanId: number, userId: number): Promise<any>;
    getEmiStatus(loanId: number): Promise<any>;
    getEmiHistory(loanId: number): Promise<any>;
}
