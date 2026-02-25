import { CompanyService } from './company.service';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    add(body: any): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    get(mobileNumber: string): Promise<{
        success: boolean;
        message: string;
        data: import("./company.entity").Company;
    }>;
}
