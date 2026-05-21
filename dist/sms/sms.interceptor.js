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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const sms_service_1 = require("./sms.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let SmsInterceptor = class SmsInterceptor {
    constructor(smsService, userRepo) {
        this.smsService = smsService;
        this.userRepo = userRepo;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                if (request.method === 'GET')
                    return;
                const url = request.url;
                let mobile = request.body?.mobileNumber ||
                    request.user?.mobileNumber ||
                    response?.data?.mobileNumber;
                if (!mobile) {
                    const userId = request.user?.userId ||
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
                    if (response?.data?.loanStatus === 'completed') {
                        message = `Congratulations! All EMIs paid! Loan completed successfully!`;
                    }
                    else {
                        message = `EMI ${response?.data?.emiNumber || ''} paid successfully! Amount: ₹${response?.data?.totalPaid || ''} Status: ${response?.data?.status || ''}`;
                    }
                }
                console.log('Sending SMS to:', mobile, 'Message:', message);
                await this.smsService.sendSms(mobile, message);
                console.log('SMS sent successfully!');
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
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [sms_service_1.SmsService,
        typeorm_2.Repository])
], SmsInterceptor);
//# sourceMappingURL=sms.interceptor.js.map