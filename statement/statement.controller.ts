import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { StatementService } from './statement.service';

@Controller('statement')
export class StatementController {

  constructor(private statementService: StatementService) {}

  @Post('submitBankDetails')
  @HttpCode(HttpStatus.OK) // 200
  async funcSubmitBankDetails() {
    return await this.statementService.uploadStatement();
  }

  @Post('summary')
  @HttpCode(HttpStatus.CREATED) // 201
  async summary(@Body('requestId') requestId: string) {
    return await this.statementService.getSummaryAndSave(requestId);
  }

  @Get('/getStatement/:requestId')
  @HttpCode(HttpStatus.OK) // 200
  async getOne(@Param('requestId') requestId: string) {
    return await this.statementService.findOneStatement(requestId);
  }
}