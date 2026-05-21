import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findOne(options: any) {
    return await this.userRepository.findOne(options);
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    if (!users || users.length === 0) {
      throw new HttpException(
        'No users found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'Users fetched successfully',
      data: {
        totalUsers: users.length,
        users,
      },
    };
  }
 async getProfile(mobileNumber:string):Promise<any>{
  console.log(mobileNumber);
  
  const user=await this.userRepository.findOne({
    where:{mobileNumber} 
  })
  console.log(user)
  if(!user){
    throw new HttpException ('user not found',HttpStatus.NOT_FOUND)
  }
  return{
    success:true,
    statusCode:HttpStatus.OK,
    message:'user profile fetch succesfully',
    data:{
      id:user.id,
      name:user.name,
      salary:user.salary,
      companyName:user.companyName,
      isVerified:user.isVerified,
      isEmploymentApproved:user.isEmploymentApproved
    }
  }
}
}
