import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { CompanyModule } from '../company/company.module';  // IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    CompanyModule,   // 
  ],
  providers: [KycService],
  controllers: [KycController],
})
export class KycModule {}


