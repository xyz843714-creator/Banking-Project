import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CompanyService } from '../company/company.service';

@Injectable()
export class KycService {
  private kycs: any[] = [];

  constructor(
    private readonly companyService: CompanyService,
  ) {}

  addKyc(
    mobileNumber: string,
    aadhaar: string,
    pan: string,
  ) {
    // Aadhaar validation
    if (!/^\d{12}$/.test(aadhaar)) {
      throw new BadRequestException(
        'Aadhaar must be 12 digits',
      );
    }

    // Proper PAN validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      throw new BadRequestException(
        'Invalid PAN format',
      );
    }

    // Check company registered
    const company =
      this.companyService.get(mobileNumber);

    //if (!company) {
      //throw new BadRequestException(
        //'Please complete company registration before KYC',
      //);
    //}

    // Prevent duplicate KYC
    const existing = this.kycs.find(
      k => k.mobileNumber === mobileNumber,
    );

    if (existing) {
      throw new BadRequestException(
        'KYC already completed',
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
      message: 'KYC completed successfully',
      data: kyc,
    };
  }

 getKyc(mobileNumber: string) {

  const kyc = this.kycs.find(
    k => k.mobileNumber === mobileNumber,
  );

  if (!kyc) {
    return {
      success: false,
      message: 'KYC not found',
      data: null,
    };
  }

  return {
    success: true,
    message: 'KYC fetched successfully',
    data: kyc,
  };
}
}





