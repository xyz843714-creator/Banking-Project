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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',       // your pg username
      password: '189730',          // your pg password
      database: 'banking_db',     // your database name
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
    EmiModule
  ],
})
export class AppModule {}




