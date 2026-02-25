import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class BankService {

  // ➤ Add Transaction (Keep Your Existing Logic Here)
  async addTransaction(body: any, user: any) {
    return {
      message: 'Transaction added successfully',
      data: body,
      user: user,
    };
  }

  // ➤ Send PDF File
  async sendStatementPdf(res: Response) {
    const filePath=join(process.cwd(),'uploads','sample.pdf');
    if(!fs.existsSync(filePath)) {
      return res.status(404).json({
        message:'PDF file not found',
        path:filePath,
      });
    }
    return res.sendFile(filePath, {
      headers:{
        'Content-Type':'application/pdf',
      },
});
  }
}
