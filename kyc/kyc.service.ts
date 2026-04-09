import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CompanyService } from '../company/company.service';

@Injectable()
export class KycService {
  private kycs: any[] = [];

  constructor(
    private readonly companyService: CompanyService,
  ) {}

  addKyc(mobileNumber: string, aadhaar: string, pan: string) {
    if (!mobileNumber) {
      throw new HttpException(
        'Mobile number is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    // Aadhaar validation
    if (!/^\d{12}$/.test(aadhaar)) {
      throw new HttpException(
        'Aadhaar must be 12 digits',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    // PAN validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      throw new HttpException(
        'Invalid PAN format',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    // Prevent duplicate KYC
    const existing = this.kycs.find(
      k => k.mobileNumber === mobileNumber,
    );

    if (existing) {
      throw new HttpException(
        'KYC already completed',
        HttpStatus.CONFLICT, // 409
      );
    }

    const kyc = {
      mobileNumber,
      aadhaar,
      pan,
      status: 'verified',
      createdAt: new Date(),
    };

    this.kycs.push(kyc);

    return {
      success: true,
      statusCode: HttpStatus.CREATED, // 201
      message: 'KYC completed successfully',
      data: kyc,
    };
  }

  getKyc(mobileNumber: string) {
    if (!mobileNumber) {
      throw new HttpException(
        'Mobile number is required',
        HttpStatus.BAD_REQUEST, // 400
      );
    }

    const kyc = this.kycs.find(
      k => k.mobileNumber === mobileNumber,
    );

    if (!kyc) {
      throw new HttpException(
        'KYC not found',
        HttpStatus.NOT_FOUND, // 404
      );
    }

    return {
      success: true,
      statusCode: HttpStatus.OK, // 200
      message: 'KYC fetched successfully',
      data: kyc,
    };
  }
}





