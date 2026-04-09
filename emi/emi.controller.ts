import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { EmiService } from './emi.service';

@Controller('emi')
export class EmiController {
  constructor(private emiService: EmiService) {}

  @Post('pay')
  @HttpCode(HttpStatus.CREATED) // 201
  async payEmi(
    @Body('loanId') loanId: number,
    @Body('userId') userId: number,
  ) {
    return await this.emiService.payEmi(loanId, userId);
  }

  @Get('status/:loanId')
  @HttpCode(HttpStatus.OK) // 200
  async getEmiStatus(@Param('loanId') loanId: number) {
    return await this.emiService.getEmiStatus(loanId);
  }

  @Get('history/:loanId')
  @HttpCode(HttpStatus.OK) // 200
  async getEmiHistory(@Param('loanId') loanId: number) {
    return await this.emiService.getEmiHistory(loanId);
  }
}