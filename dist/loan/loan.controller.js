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
exports.LoanController = void 0;
const common_1 = require("@nestjs/common");
const loan_service_1 = require("./loan.service");
let LoanController = class LoanController {
    constructor(loanService) {
        this.loanService = loanService;
    }
    async getLoanOffer(userId, requestedAmount) {
        return await this.loanService.getLoanOffer(userId, requestedAmount);
    }
    async getLoanHistory(userId) {
        return await this.loanService.getLoanHistory(userId);
    }
    async getUnpaidLoans() {
        return await this.loanService.getUnpaidLoans();
    }
    async getLoanReport(startDate, endDate, name, loanId, mobileNumber, status) {
        return await this.loanService.getLoanReport(startDate, endDate, name, loanId, mobileNumber, status);
    }
};
exports.LoanController = LoanController;
__decorate([
    (0, common_1.Post)('offer'),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('requestedAmount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getLoanOffer", null);
__decorate([
    (0, common_1.Get)('history/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getLoanHistory", null);
__decorate([
    (0, common_1.Get)('unpaid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getUnpaidLoans", null);
__decorate([
    (0, common_1.Get)('report'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('name')),
    __param(3, (0, common_1.Query)('loanId')),
    __param(4, (0, common_1.Query)('mobileNumber')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, String, String]),
    __metadata("design:returntype", Promise)
], LoanController.prototype, "getLoanReport", null);
exports.LoanController = LoanController = __decorate([
    (0, common_1.Controller)('loan'),
    __metadata("design:paramtypes", [loan_service_1.LoanService])
], LoanController);
//# sourceMappingURL=loan.controller.js.map