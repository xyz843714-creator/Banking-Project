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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const company_service_1 = require("./company.service");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async add(body) {
        const companyName = body.companyName;
        const mobileNumber = body.mobileNumber;
        const salary = body.salary;
        return await this.companyService.add(mobileNumber, companyName, salary);
    }
    async get(mobileNumber) {
        return await this.companyService.get(mobileNumber);
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Post)('add'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "add", null);
__decorate([
    (0, common_1.Get)(':mobileNumber'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('mobileNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "get", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map