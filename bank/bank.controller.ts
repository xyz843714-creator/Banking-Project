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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BankService } from './bank.service';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  // ✅ Add Transaction
  @Post('add-transaction')
  @UseGuards(AuthGuard('jwt'))
  addTransaction(@Body() body: any, @Request() req) {
    return this.bankService.addTransaction(body, req.user);
  }

  // ✅ Upload Bank Statement PDF
  @Post('upload-statement')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, 'sample' + extname(file.originalname));
        },
      }),
    }),
  )
  uploadStatement(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'PDF uploaded successfully',
      filename: file.filename,
    };
  }

  // ✅ Get Bank Statement PDF
  @Get('statement')
  @UseGuards(AuthGuard('jwt'))
  getStatement(@Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'sample.pdf');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
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







