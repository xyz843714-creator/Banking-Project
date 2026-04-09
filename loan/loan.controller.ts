import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { LoanService } from './loan.service';
import type { Response } from 'express';

@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('offer')
  @HttpCode(HttpStatus.CREATED) // 201
  async getLoanOffer(
    @Body('userId') userId: number,
    @Body('requestedAmount') requestedAmount: number,
  ) {
    return await this.loanService.getLoanOffer(userId, requestedAmount);
  }

  @Get('history/:userId')
  @HttpCode(HttpStatus.OK) // 200
  async getLoanHistory(@Param('userId') userId: number) {
    return await this.loanService.getLoanHistory(userId);
  }

  @Get('unpaid')
  @HttpCode(HttpStatus.OK) // 200
  async getUnpaidLoans() {
    return await this.loanService.getUnpaidLoans();
  }

  // ← CSV must be BEFORE report to avoid conflict
  @Get('report/csv')
  async getLoanReportCsv(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('name') name?: string,
    @Query('loanId') loanId?: number,
    @Query('mobileNumber') mobileNumber?: string,
    @Query('status') status?: string,
    @Query('emiId') emiId?: number,
    @Query('emiDueDate') emiDueDate?: string,
  ) {
    const csv = await this.loanService.getLoanReportCsv(
      page,
      limit,
      startDate,
      endDate,
      name,
      loanId,
      mobileNumber,
      status,
      emiId,
      emiDueDate,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="loan-report.csv"');
    return res.send(csv);
  }

  @Get('report')
  @HttpCode(HttpStatus.OK) // 200
  async getLoanReport(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('name') name?: string,
    @Query('loanId') loanId?: number,
    @Query('mobileNumber') mobileNumber?: string,
    @Query('status') status?: string,
    @Query('emiId') emiId?: number,
    @Query('emiDueDate') emiDueDate?: string,
  ) {
    return await this.loanService.getLoanReport(
      page,
      limit,
      startDate,
      endDate,
      name,
      loanId,
      mobileNumber,
      status,
      emiId,
      emiDueDate,
    );
  }
}


