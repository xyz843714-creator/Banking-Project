import { Controller, Post, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.signup(email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.adminService.login(email, password);
  }

  @Post('employment/approve/:userId')
  async approveEmployment(
    @Param('userId') userId: number,
    @Body('salary') salary: number,
  ) {
    return await this.adminService.approveEmployment(userId, salary);
  }
}