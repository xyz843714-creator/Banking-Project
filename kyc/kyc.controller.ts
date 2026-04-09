import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KycService } from './kyc.service';

@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED) // 201
  @UseGuards(AuthGuard('jwt')) //  JWT Token required
  add(@Body() body: any) {
    return this.kycService.addKyc(
      body.mobileNumber,
      body.aadhaar,
      body.pan,
    );
  }

  @Post('get')
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt')) //  JWT Token required
  get(@Body() body: any) {
    return this.kycService.getKyc(
      body.mobileNumber,
    );
  }
}








