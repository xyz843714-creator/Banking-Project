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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',       // pg username
      password: '189730',          //  pg password
      database: 'banking_db',     //  database name
      autoLoadEntities: true,
      synchronize: true,          // auto create tables (only for dev)
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




