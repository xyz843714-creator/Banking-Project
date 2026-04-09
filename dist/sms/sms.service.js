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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const Twilio = require('twilio');
let SmsService = class SmsService {
    constructor() {
        this.client = Twilio('AC0892f0ffc7bf0cb7e4a335c9c0c49152', '9a9309814c11117129b360d8a176dcc3');
    }
    async sendSms(to, message) {
        try {
            const formattedNumber = to.startsWith('+') ? to : `+91${to}`;
            await this.client.messages.create({
                body: message,
                from: '+17126257571',
                to: formattedNumber,
            });
            console.log(`SMS sent to ${formattedNumber}`);
        }
        catch (err) {
            console.error('SMS Error:', err.message);
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
//# sourceMappingURL=sms.service.js.map