import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './entities/admin.entity';
import { User } from '../user/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //signup proccess
  
  async signup(email: string, password: string): Promise<any> {
    const existing = await this.adminRepo.findOne({ where: { email } });

    if (existing) {
      throw new HttpException(
        'Admin already exists',
        HttpStatus.CONFLICT, // 409
      );
    }

    const hashedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    const admin = this.adminRepo.create({ email, password: hashedPassword });
    await this.adminRepo.save(admin);

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'Admin registered successfully',
      data: {
        email: admin.email,
      },
    };
  }

  // login detail

  async login(email: string, password: string): Promise<any> {
    const admin = await this.adminRepo.findOne({ where: { email } });

    if (!admin) {
      throw new HttpException(
        'Admin not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    const hashedInputPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');

    if (admin.password !== hashedInputPassword) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED, // 401
      );
    }

    const token = this.jwtService.sign({ id: admin.id, email: admin.email });

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'Login successful',
      data: {
        token,
      },
    };
  }

//proccess of approveemployment

  async approveEmployment(userId: number, salary: number): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND,  // 404
      );
    }

    if (!salary) {
      throw new HttpException(
        'Salary is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    user.isEmploymentApproved = true;
    user.salary = salary;
    await this.userRepo.save(user);

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'User employment approved successfully',
      data: {
        userId,
        salary,
      },
    };
  }
}






           
        
  