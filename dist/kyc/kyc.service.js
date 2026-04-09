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
        if (!mobileNumber) {
            throw new common_1.HttpException('Mobile number is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!/^\d{12}$/.test(aadhaar)) {
            throw new common_1.HttpException('Aadhaar must be 12 digits', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            throw new common_1.HttpException('Invalid PAN format', common_1.HttpStatus.BAD_REQUEST);
        }
        const existing = this.kycs.find(k => k.mobileNumber === mobileNumber);
        if (existing) {
            throw new common_1.HttpException('KYC already completed', common_1.HttpStatus.CONFLICT);
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
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'KYC completed successfully',
            data: kyc,
        };
    }
    getKyc(mobileNumber) {
        if (!mobileNumber) {
            throw new common_1.HttpException('Mobile number is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const kyc = this.kycs.find(k => k.mobileNumber === mobileNumber);
        if (!kyc) {
            throw new common_1.HttpException('KYC not found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
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