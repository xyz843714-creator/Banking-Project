import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Res,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BankService } from './bank.service';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import * as fs from 'fs';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  // ✅ Add Transaction
  @Post('add-transaction')
  @HttpCode(HttpStatus.CREATED) // 201
  @UseGuards(AuthGuard('jwt'))
  async addTransaction(@Body() body: any, @Request() req) {
    return await this.bankService.addTransaction(body, req.user);
  }

  // ✅ Upload Bank Statement PDF
  @Post('upload-statement')
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body('bankCode') bankCode: string,
  ) {
    return await this.bankService.uploadStatement(file, bankCode);
  }

  // ✅ Get Bank Statement PDF
  @Get('statement')
  @HttpCode(HttpStatus.OK) // 200
  @UseGuards(AuthGuard('jwt'))
  async getStatement(@Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'sample.pdf');

    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ // 404
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'PDF not found',
      });
    }

    return res.sendFile(filePath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="statement.pdf"',
      },
    });
  }
}
