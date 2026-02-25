import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
        data: {
            otp: string;
            expiresAt: Date;
        };
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    register(body: RegisterDto): Promise<{
        message: string;
        data: {
            mobileNumber: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            access_token: string;
            userId: number;
            name: string;
        };
    }>;
}
