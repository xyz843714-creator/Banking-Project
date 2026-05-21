import { HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUsers(): Promise<{
        success: boolean;
        statusCode: HttpStatus;
        message: string;
        data: {
            totalUsers: number;
            users: import("./user.entity").User[];
        };
    }>;
    getProfile(mobileNumber: string): Promise<any>;
}
