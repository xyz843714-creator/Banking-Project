import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK) // 200
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.username, dto.mobileNumber,);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK) // 200
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.mobileNumber, dto.otp);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // 201
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // 200
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.mobileNumber, dto.password);
  }
}
