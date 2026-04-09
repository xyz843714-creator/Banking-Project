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
exports.EmiPayment = void 0;
const typeorm_1 = require("typeorm");
let EmiPayment = class EmiPayment {
};
exports.EmiPayment = EmiPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmiPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmiPayment.prototype, "loanId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmiPayment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EmiPayment.prototype, "emiNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], EmiPayment.prototype, "emiAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', default: 0 }),
    __metadata("design:type", Number)
], EmiPayment.prototype, "penaltyAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], EmiPayment.prototype, "totalPaid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], EmiPayment.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], EmiPayment.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], EmiPayment.prototype, "status", void 0);
exports.EmiPayment = EmiPayment = __decorate([
    (0, typeorm_1.Entity)('emi_payment')
], EmiPayment);
//# sourceMappingURL=emi-payment.entity.js.map