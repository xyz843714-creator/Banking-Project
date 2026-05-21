import { Module } from "@nestjs/common";
import { SmsService } from "./sms.service";
import { SmsInterceptor } from "./sms.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ← add User!
  ],
  providers: [SmsService, SmsInterceptor],
  exports: [SmsService, SmsInterceptor],
})
export class SmsModule {}