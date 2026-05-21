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
const emi_payment_entity_1 = require("../emi/entities/emi-payment.entity");
let LoanService = class LoanService {
    formatDate(date) {
        if (!date)
            return '';
        const d = new Date(date);
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }
    formatCurrency(amount) {
        if (!amount)
            return '₹0';
        return `₹${Number(amount).toLocaleString('en-IN')}`;
    }
    constructor(loanRepo, userRepo, emiRepo) {
        this.loanRepo = loanRepo;
        this.userRepo = userRepo;
        this.emiRepo = emiRepo;
    }
    async getLoanOffer(userId, requestedAmount) {
        const parsedUserId = parseInt(String(userId));
        const parsedAmount = parseInt(String(requestedAmount));
        const user = await this.userRepo.findOne({
            where: { id: parsedUserId }
        });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.isEmploymentApproved) {
            throw new common_1.HttpException('User employment not approved yet', common_1.HttpStatus.FORBIDDEN);
        }
        const salary = user.salary;
        if (parsedAmount < 10000 || parsedAmount > 100000) {
            throw new common_1.HttpException('Loan amount must be between 10,000 and 1,00,000', common_1.HttpStatus.BAD_REQUEST);
        }
        let approvedAmount;
        if (salary <= 50000) {
            approvedAmount = salary * 0.25;
        }
        else {
            approvedAmount = parsedAmount;
        }
        const interestRate = 10;
        const emiCount = salary <= 50000 ? 3 : 4;
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
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Loan offer generated successfully',
            data: {
                userId: parsedUserId,
                salary: this.formatCurrency(salary),
                requestedAmount: this.formatCurrency(parsedAmount),
                approvedAmount: this.formatCurrency(approvedAmount),
                interestRate: `${interestRate}%`,
                emiCount,
                emiAmount: this.formatCurrency(parseFloat(emiAmount.toFixed(2))),
                totalRepayment: this.formatCurrency(parseFloat(totalRepayment.toFixed(2))),
                status: 'active',
            },
        };
    }
    async getLoanHistory(userId) {
        const loans = await this.loanRepo.find({
            where: { userId: parseInt(String(userId)) },
        });
        if (!loans || loans.length === 0) {
            throw new common_1.HttpException('No loan history found for this user', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
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
        if (!loans || loans.length === 0) {
            throw new common_1.HttpException('No unpaid loans found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Unpaid loans fetched successfully',
            data: {
                totalUnpaid: loans.length,
                loans,
            },
        };
    }
    async getLoanReport(page = 1, limit = 10, startDate, endDate, name, loanId, mobileNumber, status, emiId, emiDueDate) {
        const parsedPage = parseInt(String(page)) || 1;
        const parsedLimit = parseInt(String(limit)) || 10;
        const skip = (parsedPage - 1) * parsedLimit;
        const query = this.loanRepo.createQueryBuilder('loan')
            .leftJoinAndSelect('loan.user', 'user')
            .orderBy('loan.createdAt', 'DESC');
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
        if (emiId) {
            query.andWhere('loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE id = :emiId)', { emiId });
        }
        if (emiDueDate) {
            query.andWhere('loan.id IN (SELECT "loanId" FROM "emi_payment" WHERE DATE("dueDate") = :emiDueDate)', { emiDueDate });
        }
        const totalLoans = await query.getCount();
        const totalPages = Math.ceil(totalLoans / parsedLimit);
        query.skip(skip).take(parsedLimit);
        const loans = await query.getMany();
        if (!loans || loans.length === 0) {
            throw new common_1.HttpException('No loans found', common_1.HttpStatus.NOT_FOUND);
        }
        const loanWithEmis = await Promise.all(loans.map(async (loan) => {
            const emis = await this.emiRepo.find({
                where: { loanId: loan.id },
                order: { emiNumber: 'ASC' },
            });
            const emiDetails = emis.map((emi) => ({
                emiId: emi.id,
                emiNumber: emi.emiNumber,
                emiAmount: this.formatCurrency(emi.emiAmount),
                penaltyAmount: this.formatCurrency(emi.penaltyAmount),
                totalPaid: this.formatCurrency(emi.totalPaid),
                dueDate: this.formatDate(emi.dueDate),
                paidDate: this.formatDate(emi.paidDate),
                status: emi.status,
            }));
            return {
                loanId: loan.id,
                userId: loan.user?.id,
                userName: loan.user?.name,
                mobileNumber: loan.user?.mobileNumber,
                loanStatus: loan.status,
                requestedAmount: this.formatCurrency(loan.requestedAmount),
                approvedAmount: this.formatCurrency(loan.approvedAmount),
                salary: this.formatCurrency(loan.salary),
                interestRate: loan.interestRate,
                emiCount: loan.emiCount,
                emiAmount: this.formatCurrency(loan.emiAmount),
                totalRepayment: this.formatCurrency(loan.totalRepayment),
                loanCreatedAt: this.formatDate(loan.createdAt),
                emiDetails: {
                    totalEmis: loan.emiCount,
                    paidEmis: emiDetails.filter(e => e.status === 'paid' || e.status === 'delayed').length,
                    pendingEmis: emiDetails.filter(e => e.status === 'pending').length,
                    emis: emiDetails,
                },
            };
        }));
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Loan report fetched successfully',
            data: {
                totalLoans,
                totalPages,
                currentPage: parsedPage,
                limit: parsedLimit,
                loans: loanWithEmis,
            },
        };
    }
    async getLoanReportCsv(startDate, endDate, name, loanId, mobileNumber, status, emiId, emiDueDate) {
        const report = await this.getLoanReport(1, 10000, startDate, endDate, name, loanId, mobileNumber, status, emiId, emiDueDate);
        const loans = report.data.loans;
        const q = (val) => {
            if (val === null || val === undefined || val === '')
                return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
        };
        const fmtNum = (val) => {
            if (val === null || val === undefined || val === '')
                return '';
            const n = Number(String(val).replace(/,/g, ''));
            return isNaN(n) ? String(val) : String(n);
        };
        const csvHeaders = [
            'Loan ID',
            'User ID',
            'User Name',
            'Mobile Number',
            'Loan Status',
            'Requested Amount',
            'Approved Amount',
            'Salary',
            'Interest Rate',
            'EMI Count',
            'EMI Amount',
            'Total Repayment',
            'Loan Created At',
            'Total EMIs',
            'Paid EMIs',
            'Pending EMIs',
            'EMI ID',
            'EMI Number',
            'EMI Amount (EMI)',
            'Penalty Amount',
            'Total Paid',
            'Due Date',
            'Paid Date',
            'EMI Status',
        ].map(q).join(',');
        const csvRows = [];
        loans.forEach((loan) => {
            const loanCols = [
                q(loan.loanId),
                q(loan.userId),
                q(loan.userName),
                q(loan.mobileNumber),
                q(loan.loanStatus),
                q(fmtNum(loan.requestedAmount)),
                q(fmtNum(loan.approvedAmount)),
                q(fmtNum(loan.salary)),
                q(fmtNum(loan.interestRate)),
                q(fmtNum(loan.emiCount)),
                q(fmtNum(loan.emiAmount)),
                q(fmtNum(loan.totalRepayment)),
                q(loan.loanCreatedAt),
                q(loan.emiDetails.totalEmis),
                q(loan.emiDetails.paidEmis),
                q(loan.emiDetails.pendingEmis),
            ];
            if (!loan.emiDetails.emis || loan.emiDetails.emis.length === 0) {
                csvRows.push([
                    ...loanCols,
                    q(''), q(''), q(''), q(''), q(''), q(''), q(''), q(''),
                ].join(','));
            }
            else {
                loan.emiDetails.emis.forEach((emi) => {
                    csvRows.push([
                        ...loanCols,
                        q(emi.emiId),
                        q(emi.emiNumber),
                        q(fmtNum(emi.emiAmount)),
                        q(fmtNum(emi.penaltyAmount)),
                        q(fmtNum(emi.totalPaid)),
                        q(emi.dueDate),
                        q(emi.paidDate),
                        q(emi.status),
                    ].join(','));
                });
            }
        });
        const SEP = 'sep=,';
        return [SEP, csvHeaders, ...csvRows].join('\n');
    }
    async getLoanSummary(userId) {
        const parsedUserId = parseInt(String(userId));
        const loans = await this.loanRepo.find({
            where: { userId: parsedUserId }
        });
        if (!loans || loans.length === 0) {
            throw new common_1.HttpException('no loans found for this user', common_1.HttpStatus.NOT_FOUND);
        }
        const activeLoans = loans.filter(loan => loan.status === 'active').length;
        const defaultedLoans = loans.filter(loan => loan.status === 'defaulted').length;
        const totalAmount = loans.reduce((total, loan) => total + Number(loan.approvedAmount), 0);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Loan summary fetched successfully',
            data: {
                userId: parsedUserId,
                totalLoans: loans.length,
                activeLoans,
                defaultedLoans,
                totalApprovedAmount: `₹${totalAmount.toLocaleString('en-IN')}`
            },
        };
    }
};
exports.LoanService = LoanService;
exports.LoanService = LoanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(emi_payment_entity_1.EmiPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LoanService);
//# sourceMappingURL=loan.service.js.map