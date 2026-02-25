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
exports.EmiController = void 0;
const common_1 = require("@nestjs/common");
const emi_service_1 = require("./emi.service");
let EmiController = class EmiController {
    constructor(emiService) {
        this.emiService = emiService;
    }
    async payEmi(loanId, userId) {
        return await this.emiService.payEmi(loanId, userId);
    }
    async getEmiStatus(loanId) {
        return await this.emiService.getEmiStatus(loanId);
    }
    async getEmiHistory(loanId) {
        return await this.emiService.getEmiHistory(loanId);
    }
};
exports.EmiController = EmiController;
__decorate([
    (0, common_1.Post)('pay'),
    __param(0, (0, common_1.Body)('loanId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EmiController.prototype, "payEmi", null);
__decorate([
    (0, common_1.Get)('status/:loanId'),
    __param(0, (0, common_1.Param)('loanId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmiController.prototype, "getEmiStatus", null);
__decorate([
    (0, common_1.Get)('history/:loanId'),
    __param(0, (0, common_1.Param)('loanId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmiController.prototype, "getEmiHistory", null);
exports.EmiController = EmiController = __decorate([
    (0, common_1.Controller)('emi'),
    __metadata("design:paramtypes", [emi_service_1.EmiService])
], EmiController);
//# sourceMappingURL=emi.controller.js.map