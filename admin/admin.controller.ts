import { Controller, Post, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED) // 201
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.signup(email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // 200
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.login(email, password);
  }

  @Post('employment/approve/:userId')
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt')) //  JWT Token required
  async approveEmployment(
    @Param('userId') userId: number,
    @Body('salary') salary: number,
  ) {
    return await this.adminService.approveEmployment(userId, salary);
  }
}