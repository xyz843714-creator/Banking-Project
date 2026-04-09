import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as fs from 'fs';
import { BankStatement } from './entities/bank-statement.entity';

@Injectable()
export class StatementService {
  private formatCurrency(amount: any): string {
  if (!amount) return '₹0';
  const num = parseFloat(String(amount).replace(/,/g, ''));
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
  
  constructor(
    private httpService: HttpService,
    @InjectRepository(BankStatement)
    private statementRepo: Repository<BankStatement>,
  ) {}

  async uploadStatement(): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('bankCode', 'ICICI');
      formData.append('pdfFile', fs.createReadStream('./uploads/sample.pdf'));

      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:9000/api/v1/statement/extractDataBank',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );

      return {
        success: true,
        statusCode: HttpStatus.OK, // 200
        message: 'PDF uploaded successfully',
        data: {
          filename: 'sample.pdf',
          request_id: response.data.request_id,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to upload statement',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async getSummaryAndSave(requestId: string): Promise<any> {
    if (!requestId) {
      throw new HttpException(
        'Request ID is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:9000/api/v1/statement/getExtractSummary',
          { request_id: requestId },
        ),
      );

      const data: any = response.data;

      const newStatement = this.statementRepo.create({
        requestId: requestId,
        accountNumber: data.account_number,
        accountHolderName: data.account_holder_name,
        totalCredit: data.total_credit,
        totalDebit: data.total_debit,
        closingBalance: data.closing_balance,
        rawResponse: data,
      });

      await this.statementRepo.save(newStatement);

      return {
        success: true,
        statusCode: HttpStatus.CREATED, // 201
        message: 'Bank statement saved successfully',
        data: newStatement,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get summary',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async findOneStatement(requestId: string): Promise<any> {
    if (!requestId) {
      throw new HttpException(
        'Request ID is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    const statement = await this.statementRepo.findOne({
      where: { requestId },
    });

    if (!statement) {
      throw new HttpException(
        'Statement not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'Statement fetched successfully',
      data: statement,
    };
  }
}