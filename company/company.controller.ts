import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('add')
async add(@Body() body) {
 const companyName = body.companyName
 const mobileNumber = body.mobileNumber
 const salary = body.salary
    return  this.companyService. add(
      mobileNumber,
      companyName,
      salary,
    );
  }

  @Get(':mobileNumber')
  get(@Param('mobileNumber') mobileNumber: string) {
    return this.companyService.get(mobileNumber);
  }
}
