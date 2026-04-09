import { HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    add(body: any): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            companyName: string;
            salary: number;
            mobileNumber: string;
        };
    }>;
    get(mobileNumber: string): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: import("./company.entity").Company;
    }>;
}
