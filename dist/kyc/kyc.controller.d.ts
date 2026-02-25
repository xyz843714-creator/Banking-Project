import { KycService } from './kyc.service';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    add(body: any): {
        message: string;
        data: {
            mobileNumber: string;
            aadhaar: string;
            pan: string;
            status: string;
            createdAt: Date;
        };
    };
    get(body: any): {
        success: boolean;
        message: string;
        data: any;
    };
}
