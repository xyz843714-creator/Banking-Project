import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './bank.entity';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BankService],
  controllers: [BankController],
})
export class BankModule {}



