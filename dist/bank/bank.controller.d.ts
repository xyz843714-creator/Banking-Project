import { BankService } from './bank.service';
import type { Response } from 'express';
export declare class BankController {
    private readonly bankService;
    constructor(bankService: BankService);
    addTransaction(body: any, req: any): Promise<{
        message: string;
        data: any;
        user: any;
    }>;
    uploadStatement(file: Express.Multer.File): {
        message: string;
        filename: string;
    };
    getStatement(res: Response): void | Response<any, Record<string, any>>;
}
