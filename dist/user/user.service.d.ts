import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findOne(options: any): Promise<User | null>;
    getAllUsers(): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            totalUsers: number;
            users: User[];
        };
    }>;
    getProfile(mobileNumber: string): Promise<any>;
}
