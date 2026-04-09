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
}