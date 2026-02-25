import {
  Injectable,
  BadRequestException,
  NotFoundException,
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
    private userRepository:Repository<User>,
  ) {}

  async add(
    mobileNumber: string,
    name: string,
    salary: number,
  ) {

    if (salary < 10000) {
      throw new BadRequestException('Salary must be 10000 or above');
    }

    const company = this.companyRepository.create({
      companyName: name,
      salary,
      userMobile: mobileNumber,
    });

   await this.companyRepository.save(company);
   await this.userRepository.update(
    {mobileNumber},
    {
      companyName:name,
      salary:salary,
    },
   );


    return {
      success: true,
      data:{
      message: 'Company added successfully',
      },
    
    };
  }

  async get(mobileNumber: string) {

    const company = await this.companyRepository.findOne({
      where: { userMobile: mobileNumber },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      success: true,
      message: 'Company fetched successfully',
      data: company,
    };
  }
}




