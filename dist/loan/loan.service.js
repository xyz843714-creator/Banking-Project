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
exports.LoanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("./entities/loan.entity");
const user_entity_1 = require("../user/user.entity");
let LoanService = class LoanService {
    constructor(loanRepo, userRepo) {
        this.loanRepo = loanRepo;
        this.userRepo = userRepo;
    }
    async getLoanOffer(userId, requestedAmount) {
        const parsedUserId = parseInt(String(userId));
        const parsedAmount = parseInt(String(requestedAmount));
        const user = await this.userRepo.findOne({
            where: { id: parsedUserId }
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!user.isEmploymentApproved) {
            throw new common_1.BadRequestException('User employment not approved yet');
        }
        const salary = user.salary;
        if (parsedAmount < 10000 || parsedAmount > 100000) {
            throw new common_1.BadRequestException('Loan amount must be between 10,000 and 1,00,000');
        }
        let approvedAmount;
        if (salary < 50000) {
            approvedAmount = salary * 0.25;
        }
        else {
            approvedAmount = parsedAmount;
        }
        const interestRate = 10;
        const emiCount = salary < 50000 ? 3 : 4;
        const totalInterest = (approvedAmount * interestRate) / 100;
        const totalRepayment = approvedAmount + totalInterest;
        const emiAmount = totalRepayment / emiCount;
        let loan = await this.loanRepo.findOne({
            where: { userId: parsedUserId }
        });
        if (loan) {
            loan.requestedAmount = parsedAmount;
            loan.approvedAmount = approvedAmount;
            loan.salary = salary;
            loan.interestRate = interestRate;
            loan.emiCount = emiCount;
            loan.emiAmount = parseFloat(emiAmount.toFixed(2));
            loan.totalRepayment = parseFloat(totalRepayment.toFixed(2));
            loan.status = 'active';
        }
        else {
            loan = this.loanRepo.create({
                userId: parsedUserId,
                requestedAmount: parsedAmount,
                approvedAmount,
                salary,
                interestRate,
                emiCount,
                emiAmount: parseFloat(emiAmount.toFixed(2)),
                totalRepayment: parseFloat(totalRepayment.toFixed(2)),
                status: 'active',
            });
        }
        await this.loanRepo.save(loan);
        return {
            message: 'Loan offer generated successfully',
            data: {
                userId: parsedUserId,
                salary,
                requestedAmount: parsedAmount,
                approvedAmount,
                interestRate: `${interestRate}%`,
                emiCount,
                emiAmount: parseFloat(emiAmount.toFixed(2)),
                totalRepayment: parseFloat(totalRepayment.toFixed(2)),
                status: 'active',
            },
        };
    }
    async getLoanHistory(userId) {
        const loans = await this.loanRepo.find({
            where: { userId: parseInt(String(userId)) },
        });
        if (!loans || loans.length === 0) {
            throw new common_1.BadRequestException('No loan history found for this user');
        }
        return {
            message: 'Loan history fetched successfully',
            data: {
                userId,
                totalLoans: loans.length,
                loans,
            },
        };
    }
    async getUnpaidLoans() {
        const loans = await this.loanRepo.find({
            where: { status: 'active' },
        });
        return {
            message: 'Unpaid loans fetched successfully',
            data: {
                totalUnpaid: loans.length,
                loans,
            },
        };
    }
    async getLoanReport(startDate, endDate, name, loanId, mobileNumber, status) {
        const query = this.loanRepo
            .createQueryBuilder('loan')
            .leftJoin('user', 'user', 'user.id = loan.userId')
            .addSelect([
            'user.id',
            'user.name',
            'user.mobileNumber',
        ]);
        if (startDate && endDate) {
            query.andWhere('loan.createdAt BETWEEN :startDate AND :endDate', {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });
        }
        if (loanId) {
            query.andWhere('loan.id = :loanId', { loanId });
        }
        if (status) {
            query.andWhere('loan.status = :status', { status });
        }
        if (name) {
            query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
        }
        if (mobileNumber) {
            query.andWhere('user.mobileNumber = :mobileNumber', { mobileNumber });
        }
        const loans = await query.getRawMany();
        if (!loans || loans.length === 0) {
            throw new common_1.BadRequestException('No loans found');
        }
        return {
            message: 'Loan report fetched successfully',
            data: {
                totalLoans: loans.length,
                loans,
            },
        };
    }
};
exports.LoanService = LoanService;
exports.LoanService = LoanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LoanService);
//# sourceMappingURL=loan.service.js.map