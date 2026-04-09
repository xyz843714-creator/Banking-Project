import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED) // 201
  @UseGuards(AuthGuard('jwt')) //  JWT Token required
  async add(@Body() body) {
    const companyName = body.companyName;
    const mobileNumber = body.mobileNumber;
    const salary = body.salary;
    return await this.companyService.add(
      mobileNumber,
      companyName,
      salary,
    );
  }

  @Get(':mobileNumber')
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt')) //  JWT Token required
  async get(@Param('mobileNumber') mobileNumber: string) {
    return await this.companyService.get(mobileNumber);
  }
}
