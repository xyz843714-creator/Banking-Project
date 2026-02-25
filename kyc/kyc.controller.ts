import { Controller, Post, Body } from '@nestjs/common';
import { KycService } from './kyc.service';
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}
  @Post('add')
  add(@Body() body: any) {
    return this.kycService.addKyc(
      body.mobileNumber,
      body.aadhaar,
      body.pan,
    );
  }
  @Post('get')
  get(@Body() body: any) {
    return this.kycService.getKyc(
      body.mobileNumber,
    );
  }
}








