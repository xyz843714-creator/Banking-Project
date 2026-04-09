import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { SmsService } from "./sms.service";
export declare class SmsInterceptor implements NestInterceptor {
    private smsService;
    constructor(smsService: SmsService);
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}
