import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import*as crypto from 'crypto';
import bodyParser from 'body-parser';

@Injectable()
export class AuthService {
  private STATIC_OTP = '189730';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendOtp(username: string, mobileNumber: string) {
    if (!mobileNumber) {
      throw new BadRequestException('Mobile number is required');
    }

    const user = await this.userService.findOne({ where: { mobileNumber } });
   

    if (user) {
      throw new BadRequestException('User already exists');
    }

    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);

    await this.userService.create({
      mobileNumber,
      name: username,
      password: undefined,
      otp: this.STATIC_OTP,
      otpExpiry: expiry,
      isVerified: false,
    });

    return {
      success:true,
      message: 'OTP sent successfully',
      data:{
      otp: this.STATIC_OTP,
      expiresAt: expiry,
      }
    };
  }

  async verifyOtp(mobileNumber: string, otp: string) {
    const user = await this.userService.findOne({ where: { mobileNumber } });

    if (!user)
      throw new BadRequestException('User not found');

    if (user.otp !== otp)
      throw new BadRequestException('Incorrect OTP');

    if (new Date() > user.otpExpiry)
      throw new BadRequestException('OTP expired');

    user.isVerified = true;
    await this.userRepository.save(user);

    return { message: 'OTP verified successfully' };
  }

  async register(body: RegisterDto) {
    const hashedPassword = crypto
      .createHash('md5')
      .update(body.password)
      .digest('hex');

    const { mobileNumber } = body;
    const userOptions = { where: { mobileNumber: mobileNumber } };
    const user = await this.userService.findOne(userOptions);

    if (!user || !user.isVerified)
      throw new BadRequestException('OTP not verified');

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { 
      message: 'Registration successful' ,
      data: {
        mobileNumber: user.mobileNumber,
      },
    };
  }

  async login(mobileNumber: string, password: string) {
    const user = await this.userService.findOne({ where: { mobileNumber } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashedInputPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    if (user.password !== hashedInputPassword)
      throw new BadRequestException('Invalid password');

    const payload = { mobileNumber };

    return {
      message: 'login successfully',
      data: {
        access_token: this.jwtService.sign(payload),
        userId: user.id,
        name: user.name,
      },
    };
  }
}









 


