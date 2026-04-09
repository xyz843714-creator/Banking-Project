import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { User } from '../user/user.entity';
export declare class AdminService {
    private adminRepo;
    private userRepo;
    private jwtService;
    constructor(adminRepo: Repository<Admin>, userRepo: Repository<User>, jwtService: JwtService);
    signup(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
    approveEmployment(userId: number, salary: number): Promise<any>;
}
