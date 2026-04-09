"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const sms_service_1 = require("./sms.service");
let SmsInterceptor = class SmsInterceptor {
    constructor(smsService) {
        this.smsService = smsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                const mobile = request.body?.mobileNumber ||
                    request.user?.mobileNumber;
                if (!mobile)
                    return;
                if (request.method === 'GET')
                    return;
                let message = 'Operation successful';
                const url = request.url;
                if (url.includes('send-otp'))
                    message = 'OTP sent successfully';
                else if (url.includes('verify-otp'))
                    message = 'OTP verified successfully';
                else if (url.includes('register'))
                    message = 'Registration successful';
                else if (url.includes('login'))
                    message = 'Login successful';
                else if (url.includes('kyc/add'))
                    message = 'KYC added successfully';
                else if (url.includes('company/add'))
                    message = 'Company added successfully';
                else if (url.includes('approve'))
                    message = 'LOAN approved successfully';
                else if (url.includes('loan'))
                    message = 'LOAN processed successfully';
                else if (url.includes('emi/pay'))
                    message = 'EMI paid successfully';
                await this.smsService.sendSms(mobile, message);
            }
            catch (e) {
                console.error('Interceptor SMS Error:', e.message);
            }
        }));
    }
};
exports.SmsInterceptor = SmsInterceptor;
exports.SmsInterceptor = SmsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsInterceptor);
//# sourceMappingURL=sms.interceptor.js.map