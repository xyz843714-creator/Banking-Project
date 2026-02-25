import { Response } from 'express';
export declare class BankService {
    addTransaction(body: any, user: any): Promise<{
        message: string;
        data: any;
        user: any;
    }>;
    sendStatementPdf(res: Response): Promise<void | Response<any, Record<string, any>>>;
}
