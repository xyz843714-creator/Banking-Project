"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const emi_controller_1 = require("./emi.controller");
const emi_service_1 = require("./emi.service");
const emi_payment_entity_1 = require("./entities/emi-payment.entity");
const loan_entity_1 = require("../loan/entities/loan.entity");
let EmiModule = class EmiModule {
};
exports.EmiModule = EmiModule;
exports.EmiModule = EmiModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([emi_payment_entity_1.EmiPayment, loan_entity_1.Loan])],
        controllers: [emi_controller_1.EmiController],
        providers: [emi_service_1.EmiService],
    })
], EmiModule);
//# sourceMappingURL=emi.module.js.map