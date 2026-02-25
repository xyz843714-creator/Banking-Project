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
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("../company/company.service");
let KycService = class KycService {
    constructor(companyService) {
        this.companyService = companyService;
        this.kycs = [];
    }
    addKyc(mobileNumber, aadhaar, pan) {
        if (!/^\d{12}$/.test(aadhaar)) {
            throw new common_1.BadRequestException('Aadhaar must be 12 digits');
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            throw new common_1.BadRequestException('Invalid PAN format');
        }
        const company = this.companyService.get(mobileNumber);
        const existing = this.kycs.find(k => k.mobileNumber === mobileNumber);
        if (existing) {
            throw new common_1.BadRequestException('KYC already completed');
        }
        const kyc = {
            mobileNumber,
            aadhaar,
            pan,
            status: 'verified',
            createdAt: new Date(),
        };
        this.kycs.push(kyc);
        return {
            message: 'KYC completed successfully',
            data: kyc,
        };
    }
    getKyc(mobileNumber) {
        const kyc = this.kycs.find(k => k.mobileNumber === mobileNumber);
        if (!kyc) {
            return {
                success: false,
                message: 'KYC not found',
                data: null,
            };
        }
        return {
            success: true,
            message: 'KYC fetched successfully',
            data: kyc,
        };
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], KycService);
//# sourceMappingURL=kyc.service.js.map