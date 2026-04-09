import { Injectable,NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { SmsService } from "./sms.service";

@Injectable()
export class SmsInterceptor implements NestInterceptor{
    constructor (private smsService: SmsService) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const request = 
        context.switchToHttp().getRequest();

        return next.handle().pipe(
            tap(async (response)=>{
                try{
                    const mobile=
                    request.body?.mobileNumber ||
                    request.user?.mobileNumber;

                    if(!mobile) return;

                    if(request.method==='GET')return;
                    
                    let message='Operation successful';

                    const url= request.url;
                    if(url.includes('send-otp'))
                        message='OTP sent successfully';
                    else if (url.includes('verify-otp'))
                        message = 'OTP verified successfully';
                    else if (url.includes('register'))
                        message =  'Registration successful';
                    else if (url.includes('login'))
                        message = 'Login successful';
                    else if (url.includes('kyc/add'))
                        message= 'KYC added successfully';
                    else if (url.includes('company/add'))
                        message= 'Company added successfully';
                    else if (url.includes('approve'))
                        message= 'LOAN approved successfully';
                    else if (url.includes('loan'))
                        message= 'LOAN processed successfully';
                    else if (url.includes('emi/pay'))
                        message= 'EMI paid successfully';

                    await this.smsService.sendSms(mobile,message);
}catch (e) {
    console.error('Interceptor SMS Error:',e.message);
}
            }),
        );
    }
}