import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    return await this.userService.getAllUsers();
  }
}




