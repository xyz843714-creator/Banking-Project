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
exports.Loan = void 0;
const typeorm_1 = require("typeorm");
let Loan = class Loan {
};
exports.Loan = Loan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Loan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Loan.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Loan.prototype, "requestedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], Loan.prototype, "approvedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Loan.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Loan.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Loan.prototype, "emiCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], Loan.prototype, "emiAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], Loan.prototype, "totalRepayment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Loan.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Loan.prototype, "createdAt", void 0);
exports.Loan = Loan = __decorate([
    (0, typeorm_1.Entity)('loan')
], Loan);
//# sourceMappingURL=loan.entity.js.map