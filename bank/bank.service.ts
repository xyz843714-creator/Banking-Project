import { join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
const FormData = require('form-data');

@Injectable()
export class BankService {

  async uploadStatement(file: Express.Multer.File, bankCode: string) {
    try {
      if (!file) {
        throw new HttpException(
          'File is required',
          HttpStatus.BAD_REQUEST, // 400
        );
      }

      if (!bankCode) {
        throw new HttpException(
          'Bank code is required',
          HttpStatus.BAD_REQUEST, // 400
        );
      }

      const fd = new FormData();
      fd.append('file', file.buffer, file.originalname);
      fd.append('bankCode', bankCode);

      const response = await axios.post(
        'http://localhost:9000/api/v1/statement/extractDataBank',
        fd,
        { headers: fd.getHeaders() }
      );

      return {
        success: true,
        statusCode: HttpStatus.OK, // 200
        message: 'PDF uploaded successfully',
        data: {
          filename: file.originalname,
          requestId: response.data.request_id,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to upload statement',
        HttpStatus.INTERNAL_SERVER_ERROR, // 500
      );
    }
  }

  async addTransaction(body: any, user: any) {
    if (!body) {
      throw new HttpException(
        'Transaction data is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'Transaction added successfully',
      data: {
        body,
        user,
      },
    };
  }

  async sendStatementPdf(res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'sample.pdf');

    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ // 404
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'PDF file not found',
      });
    }

    return res.sendFile(filePath, {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }
}
