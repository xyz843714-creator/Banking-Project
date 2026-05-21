"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const logger_middleware_1 = require("./common/logger.middleware");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const company_module_1 = require("./company/company.module");
const kyc_module_1 = require("./kyc/kyc.module");
const bank_module_1 = require("./bank/bank.module");
const statement_module_1 = require("./statement/statement.module");
const admin_module_1 = require("./admin/admin.module");
const loan_module_1 = require("./loan/loan.module");
const emi_module_1 = require("./emi/emi.module");
const core_1 = require("@nestjs/core");
const sms_module_1 = require("./sms/sms.module");
const sms_interceptor_1 = require("./sms/sms.interceptor");
const user_entity_1 = require("./user/user.entity");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || '189730',
                database: process.env.DB_NAME || 'banking_db',
                autoLoadEntities: true,
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            company_module_1.CompanyModule,
            kyc_module_1.KycModule,
            bank_module_1.BankModule,
            statement_module_1.StatementModule,
            admin_module_1.AdminModule,
            loan_module_1.LoanModule,
            emi_module_1.EmiModule,
            sms_module_1.SmsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: sms_interceptor_1.SmsInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map