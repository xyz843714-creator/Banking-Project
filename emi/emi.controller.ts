import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EmiService } from './emi.service';

@Controller('emi')
export class EmiController {
  constructor(private emiService: EmiService) {}

  @Post('pay')
  async payEmi(
    @Body('loanId') loanId: number,
    @Body('userId') userId: number,
  ) {
    return await this.emiService.payEmi(loanId, userId);
  }

  @Get('status/:loanId')
  async getEmiStatus(@Param('loanId') loanId: number) {
    return await this.emiService.getEmiStatus(loanId);
  }

  @Get('history/:loanId')
  async getEmiHistory(@Param('loanId') loanId: number) {
    return await this.emiService.getEmiHistory(loanId);
  }
}