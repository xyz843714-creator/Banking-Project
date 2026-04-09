import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private STATIC_OTP = '189730';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //sending otp
  
  async sendOtp(username: string, mobileNumber: string) {
    if (!mobileNumber) {
      throw new HttpException(
        'Mobile number is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

   

    if (!username) {
      throw new HttpException(
        'Username is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    let user = await this.userService.findOne({
      where:{mobileNumber},
    });
  
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    if (user) {
      user.otp=this.STATIC_OTP;
      user.otpExpiry=expiry;
      await this.userRepository.save(user);
    }else{

     user = await this.userService.create({
      mobileNumber,
      name: username,
      password: undefined,
      otp: this.STATIC_OTP,
      otpExpiry: expiry,
      isVerified: false,
    });
  }

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'OTP sent successfully',
      data: {
        otp: this.STATIC_OTP,
        expiresAt: expiry,
      },
    };
  }

  //verifiyng proccess

  async verifyOtp(mobileNumber: string, otp: string) {
    const user = await this.userService.findOne({ where: { mobileNumber } });

    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND, // 404
      );

    if (user.otp !== otp)
      throw new HttpException(
        'Incorrect OTP',
        HttpStatus.BAD_REQUEST, // 400
      );

    if (new Date() > user.otpExpiry)
      throw new HttpException(
        'OTP expired',
        HttpStatus.BAD_REQUEST, // 400
      );

    user.isVerified = true;
    await this.userRepository.save(user);

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      data: {
        message: 'OTP verified successfully',
      },
    };
  }

//registration required
private hashPassword(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex');
}
  async register(body: RegisterDto) {
    const hashedPassword = crypto
      .createHash('md5')
      .update(body.password)
      .digest('hex');

    const { mobileNumber } = body;
    const user = await this.userService.findOne({
      where: { mobileNumber },
    });

    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND, // 404
      );

    if (!user.isVerified)
      throw new HttpException(
        'OTP not verified',
        HttpStatus.BAD_REQUEST, // 400
      );

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'Registration successful',
      data: {
        mobileNumber: user.mobileNumber,
      },
    };
  }

  //login proccess

  async login(mobileNumber: string, password: string) {
    const user = await this.userService.findOne({ where: { mobileNumber } });

    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND, // 404
      );

    const hashedInputPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    if (user.password !== hashedInputPassword)
      throw new HttpException(
        'Invalid password',
        HttpStatus.UNAUTHORIZED, // 401
      );

    const payload = { mobileNumber };

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload),
        userId: user.id,
        name: user.name,
      },
    };
  }

}









 


