import { HttpStatus } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
export declare class KycService {
    private readonly companyService;
    private kycs;
    constructor(companyService: CompanyService);
    addKyc(mobileNumber: string, aadhaar: string, pan: string): {
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            mobileNumber: string;
            aadhaar: string;
            pan: string;
            status: string;
            createdAt: Date;
        };
    };
    getKyc(mobileNumber: string): {
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: any;
    };
}
