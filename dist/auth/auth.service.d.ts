import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private jwtService;
    private userService;
    private userRepository;
    private STATIC_OTP;
    constructor(jwtService: JwtService, userService: UserService, userRepository: Repository<User>);
    sendOtp(username: string, mobileNumber: string): Promise<{
        success: boolean;
        message: string;
        data: {
            otp: string;
            expiresAt: Date;
        };
    }>;
    verifyOtp(mobileNumber: string, otp: string): Promise<{
        message: string;
    }>;
    register(body: RegisterDto): Promise<{
        message: string;
        data: {
            mobileNumber: string;
        };
    }>;
    login(mobileNumber: string, password: string): Promise<{
        message: string;
        data: {
            access_token: string;
            userId: number;
            name: string;
        };
    }>;
}
