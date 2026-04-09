import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
export declare class BankService {
    uploadStatement(file: Express.Multer.File, bankCode: string): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            filename: string;
            requestId: any;
        };
    }>;
    addTransaction(body: any, user: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            body: any;
            user: any;
        };
    }>;
    sendStatementPdf(res: Response): Promise<void | Response<any, Record<string, any>>>;
}
