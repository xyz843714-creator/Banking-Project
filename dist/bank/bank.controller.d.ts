import { HttpStatus } from '@nestjs/common';
import { BankService } from './bank.service';
import type { Response } from 'express';
export declare class BankController {
    private readonly bankService;
    constructor(bankService: BankService);
    addTransaction(body: any, req: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            body: any;
            user: any;
        };
    }>;
    uploadStatement(file: Express.Multer.File, bankCode: string): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            filename: string;
            requestId: any;
        };
    }>;
    getStatement(res: Response): Promise<void | Response<any, Record<string, any>>>;
}
