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
exports.StatementController = void 0;
const common_1 = require("@nestjs/common");
const statement_service_1 = require("./statement.service");
let StatementController = class StatementController {
    constructor(statementService) {
        this.statementService = statementService;
    }
    async funcSubmitBankDetails() {
        return await this.statementService.uploadStatement();
    }
    async summary(requestId) {
        return await this.statementService.getSummaryAndSave(requestId);
    }
    async getOne(requestId) {
        return await this.statementService.findOneStatement(requestId);
    }
};
exports.StatementController = StatementController;
__decorate([
    (0, common_1.Post)('submitBankDetails'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "funcSubmitBankDetails", null);
__decorate([
    (0, common_1.Post)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)('/getStatement/:requestId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatementController.prototype, "getOne", null);
exports.StatementController = StatementController = __decorate([
    (0, common_1.Controller)('statement'),
    __metadata("design:paramtypes", [statement_service_1.StatementService])
], StatementController);
//# sourceMappingURL=statement.controller.js.map