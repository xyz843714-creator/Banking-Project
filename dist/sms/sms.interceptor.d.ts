import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { SmsService } from "./sms.service";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
export declare class SmsInterceptor implements NestInterceptor {
    private smsService;
    private userRepo;
    constructor(smsService: SmsService, userRepo: Repository<User>);
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}
