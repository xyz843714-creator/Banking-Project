import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { tap } from "rxjs/operators";
import { SmsService } from "./sms.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class SmsInterceptor implements NestInterceptor {
  constructor(
    private smsService: SmsService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          if (request.method === 'GET') return;

          const url = request.url;

          // ← get mobile from all possible places!
          let mobile =
            request.body?.mobileNumber ||
            request.user?.mobileNumber ||
            response?.data?.mobileNumber;

          // ← if mobile not found → get from database using userId!
          if (!mobile) {
            const userId =
              request.user?.userId ||
              request.body?.userId ||
              response?.data?.userId;

            if (userId) {
              const user = await this.userRepo.findOne({
                where: { id: parseInt(String(userId)) }
              });
              mobile = user?.mobileNumber;
              console.log('Mobile from DB:', mobile);
            }
          }

          // ← for employment/approve → get mobile from URL params!
          if (!mobile && url.includes('employment/approve')) {
            const userId = request.params?.userId;
            if (userId) {
              const user = await this.userRepo.findOne({
                where: { id: parseInt(String(userId)) }
              });
              mobile = user?.mobileNumber;
              console.log('Mobile from approve params:', mobile);
            }
          }

          if (!mobile) {
            console.log('No mobile found! Skipping SMS!');
            return;
          }

          let message = 'Operation successful';

          if (url.includes('send-otp'))
            message = `Your OTP is ${response?.data?.otp || ''}. Valid for 5 minutes!`;

          else if (url.includes('verify-otp'))
            message = 'OTP verified successfully!';

          else if (url.includes('register'))
            message = 'Registration successful! Welcome to Banking App!';

          else if (url.includes('login'))
            message = 'Login successful! Welcome back!';

          else if (url.includes('kyc/add'))
            message = 'KYC completed successfully!';

          else if (url.includes('company/add'))
            message = 'Company added successfully!';

          else if (url.includes('employment/approve'))
            message = 'Congratulations! Employment approved! You can now apply for loan!';

          else if (url.includes('loan/offer'))
            message = `Loan approved! Amount: ₹${response?.data?.approvedAmount || ''} EMI: ₹${response?.data?.emiAmount || ''} Count: ${response?.data?.emiCount || ''}`;

          else if (url.includes('emi/pay')) {
            // ← check if loan completed!
            if (response?.data?.loanStatus === 'completed') {
              message = `Congratulations! All EMIs paid! Loan completed successfully!`;
            } else {
              message = `EMI ${response?.data?.emiNumber || ''} paid successfully! Amount: ₹${response?.data?.totalPaid || ''} Status: ${response?.data?.status || ''}`;
            }
          }

          console.log('Sending SMS to:', mobile, 'Message:', message);
          await this.smsService.sendSms(mobile, message);
          console.log('SMS sent successfully!');

        } catch(e) {
          console.error('Interceptor SMS Error:', e.message);
        }
      }),
    );
  }
}