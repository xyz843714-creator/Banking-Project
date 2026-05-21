import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { User } from 'user/user.entity';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async add(mobileNumber: string, name: string, salary: number) {
    if (!mobileNumber) {
      throw new HttpException(
        'Mobile number is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    if (!name) {
      throw new HttpException(
        'Company name is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    if (!salary) {
      throw new HttpException(
        'Salary is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    if (salary < 10000) {
      throw new HttpException(
        'Salary must be 10,000 or above',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    // Check if company already exists
    

   

    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { mobileNumber },
    });

    if (!user) {
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    const company = this.companyRepository.create({
      companyName: name,
      salary,
      userMobile: mobileNumber,
    });

    await this.companyRepository.save(company);

    await this.userRepository.update(
      { mobileNumber },
      {
        companyName: name,
        salary: salary,
      },
    );

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'Company added successfully',
      data: {
        companyName: name,
        salary,
        mobileNumber,
      },
    };
  }

  async get(mobileNumber: string) {
    if (!mobileNumber) {
      throw new HttpException(
        'Mobile number is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    const company = await this.companyRepository.findOne({
      where: { userMobile: mobileNumber },
    });

    if (!company) {
      throw new HttpException(
        'Company not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'Company fetched successfully',
      data: company,
    };
  }
}




