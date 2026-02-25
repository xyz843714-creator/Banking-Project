import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { User } from 'user/user.entity';
export declare class CompanyService {
    private readonly companyRepository;
    private userRepository;
    constructor(companyRepository: Repository<Company>, userRepository: Repository<User>);
    add(mobileNumber: string, name: string, salary: number): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    get(mobileNumber: string): Promise<{
        success: boolean;
        message: string;
        data: Company;
    }>;
}
