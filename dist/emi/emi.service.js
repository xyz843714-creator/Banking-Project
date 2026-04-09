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
exports.EmiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const emi_payment_entity_1 = require("./entities/emi-payment.entity");
const loan_entity_1 = require("../loan/entities/loan.entity");
let EmiService = class EmiService {
    constructor(emiRepo, loanRepo) {
        this.emiRepo = emiRepo;
        this.loanRepo = loanRepo;
    }
    async payEmi(loanId, userId) {
        const loan = await this.loanRepo.findOne({
            where: { id: parseInt(String(loanId)) },
        });
        if (!loan) {
            throw new common_1.HttpException('Loan not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (loan.status === 'completed') {
            throw new common_1.HttpException('Loan already completed', common_1.HttpStatus.BAD_REQUEST);
        }
        if (loan.status === 'defaulted') {
            throw new common_1.HttpException('Loan defaulted', common_1.HttpStatus.BAD_REQUEST);
        }
        const paidEmis = await this.emiRepo.find({
            where: { loanId: parseInt(String(loanId)) },
        });
        const paidCount = paidEmis.filter(e => e.status === 'paid' || e.status === 'delayed').length;
        if (paidCount >= loan.emiCount) {
            throw new common_1.HttpException('All EMIs already paid', common_1.HttpStatus.BAD_REQUEST);
        }
        const emiNumber = paidCount + 1;
        const loanCreatedAt = new Date(loan.createdAt);
        const dueDate = new Date(loanCreatedAt);
        dueDate.setMonth(dueDate.getMonth() + emiNumber);
        const today = new Date();
        const isDelayed = today > dueDate;
        const penaltyAmount = isDelayed
            ? parseFloat((loan.emiAmount * 0.02).toFixed(2))
            : 0;
        const totalPaid = parseFloat((Number(loan.emiAmount) + penaltyAmount).toFixed(2));
        const emiStatus = isDelayed ? 'delayed' : 'paid';
        const emi = this.emiRepo.create({
            loanId: parseInt(String(loanId)),
            userId: parseInt(String(userId)),
            emiNumber,
            emiAmount: loan.emiAmount,
            penaltyAmount,
            totalPaid,
            dueDate,
            paidDate: today,
            status: emiStatus,
        });
        await this.emiRepo.save(emi);
        if (emiNumber === loan.emiCount) {
            loan.status = 'completed';
            await this.loanRepo.save(loan);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: `EMI ${emiNumber} paid successfully`,
            data: {
                emiNumber,
                emiAmount: loan.emiAmount,
                penaltyAmount,
                totalPaid,
                dueDate,
                paidDate: today,
                status: emiStatus,
                loanStatus: emiNumber === loan.emiCount ? 'completed' : 'active',
            },
        };
    }
    async getEmiStatus(loanId) {
        const loan = await this.loanRepo.findOne({
            where: { id: parseInt(String(loanId)) },
        });
        if (!loan) {
            throw new common_1.HttpException('Loan not found', common_1.HttpStatus.NOT_FOUND);
        }
        const emis = await this.emiRepo.find({
            where: { loanId: parseInt(String(loanId)) },
        });
        const paidCount = emis.filter(e => e.status === 'paid' || e.status === 'delayed').length;
        const remainingEmis = loan.emiCount - paidCount;
        const loanCreatedAt = new Date(loan.createdAt);
        const nextDueDate = new Date(loanCreatedAt);
        nextDueDate.setMonth(nextDueDate.getMonth() + paidCount + 1);
        const loanEndDate = new Date(loanCreatedAt);
        loanEndDate.setMonth(loanEndDate.getMonth() + loan.emiCount);
        const today = new Date();
        const timeLeft = Math.ceil((loanEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (today > loanEndDate && loan.status !== 'completed') {
            loan.status = 'defaulted';
            await this.loanRepo.save(loan);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: timeLeft <= 0 ? 'Loan time finished' : `${timeLeft} days left`,
            data: {
                loanId,
                loanStatus: loan.status,
                totalEmis: loan.emiCount,
                paidEmis: paidCount,
                remainingEmis,
                emiAmount: loan.emiAmount,
                nextDueDate: remainingEmis > 0 ? nextDueDate : null,
                loanEndDate,
                daysLeft: timeLeft > 0 ? timeLeft : 0,
            },
        };
    }
    async getEmiHistory(loanId) {
        const emis = await this.emiRepo.find({
            where: { loanId: parseInt(String(loanId)) },
        });
        if (!emis || emis.length === 0) {
            throw new common_1.HttpException('No EMI history found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'EMI history fetched successfully',
            data: {
                loanId,
                totalEmis: emis.length,
                emis,
            },
        };
    }
};
exports.EmiService = EmiService;
exports.EmiService = EmiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(emi_payment_entity_1.EmiPayment)),
    __param(1, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmiService);
//# sourceMappingURL=emi.service.js.map