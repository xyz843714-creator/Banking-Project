import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { KycModule } from './kyc/kyc.module';
import { BankModule } from './bank/bank.module';
import { StatementModule } from './statement/statement.module';
import { AdminModule } from './admin/admin.module';
import { LoanModule } from './loan/loan.module';
import { EmiModule } from './emi/emi.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SmsModule } from './sms/sms.module';
import { SmsInterceptor } from './sms/sms.interceptor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, // ← available everywhere!
    }),
    TypeOrmModule.forRoot({
     type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '189730',
      database: process.env.DB_NAME || 'banking_db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    AuthModule,
    UserModule,
    CompanyModule,
    KycModule,
    BankModule,
    StatementModule,
    AdminModule,
    LoanModule,
    EmiModule,
    SmsModule,
  ],
  providers:[
    {
      provide:APP_INTERCEPTOR,
      useClass:SmsInterceptor,
    },
  ],
})
export class AppModule {}




