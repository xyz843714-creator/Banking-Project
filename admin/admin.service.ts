import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

  //create signup page
  //requirment for signup what is needed

  async signup(email: string, password: string): Promise<any> {
    const existing = await this.adminRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

    const admin = this.adminRepo.create({ email, password: hashedPassword });
    await this.adminRepo.save(admin);
    return { 
      success:true,
      data:{
        message: 'Admin registered successfully' 
      }
    }
  }

  // requirment for login

  async login(email: string, password: string): Promise<any> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hashedInputPassword=crypto
    .createHash('md5')
    .update(password)
    .digest('hex');

    if (admin.password !==hashedInputPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
   
    const token = this.jwtService.sign({ id: admin.id, email: admin.email });
    return { 
      success:true,
      data:{
      message: 'Login successful', 
      token ,
      },
    };
  }

  // creating api that approve user
  
  //employment requirment addind 

  async approveEmployment(userId: number, salary: number): Promise<any> {
    console.log('Looking for userId:', userId);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    console.log('Found user:', user);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.isEmploymentApproved = true;
    user.salary = salary;
    await this.userRepo.save(user);
    return {
       message: 'User employment approved successfully',
       data:{
         userId, 
         salary
       },
      };
  };
}






           
        
  