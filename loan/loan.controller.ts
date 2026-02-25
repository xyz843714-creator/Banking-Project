import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { LoanService } from './loan.service';

@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('offer')
  async getLoanOffer(
    @Body('userId') userId: number,
    @Body('requestedAmount') requestedAmount: number,
  ) {
    return await this.loanService.getLoanOffer(userId, requestedAmount);
  }

  @Get('history/:userId')
  async getLoanHistory(@Param('userId') userId: number) {
    return await this.loanService.getLoanHistory(userId);
  }

  @Get('unpaid')
  async getUnpaidLoans() {
    return await this.loanService.getUnpaidLoans();
  }

  @Get('report')
  async getLoanReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('name') name?: string,
    @Query('loanId') loanId?: number,
    @Query('mobileNumber') mobileNumber?: string,
    @Query('status') status?: string,
  ) {
    return await this.loanService.getLoanReport(
      startDate,
      endDate,
      name,
      loanId,
      mobileNumber,
      status,
    );
  }
}



