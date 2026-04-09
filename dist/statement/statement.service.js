"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatementService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const form_data_1 = __importDefault(require("form-data"));
const fs = __importStar(require("fs"));
const bank_statement_entity_1 = require("./entities/bank-statement.entity");
let StatementService = class StatementService {
    formatCurrency(amount) {
        if (!amount)
            return '₹0';
        const num = parseFloat(String(amount).replace(/,/g, ''));
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    constructor(httpService, statementRepo) {
        this.httpService = httpService;
        this.statementRepo = statementRepo;
    }
    async uploadStatement() {
        try {
            const formData = new form_data_1.default();
            formData.append('bankCode', 'ICICI');
            formData.append('pdfFile', fs.createReadStream('./uploads/sample.pdf'));
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:9000/api/v1/statement/extractDataBank', formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            }));
            return {
                success: true,
                statusCode: common_1.HttpStatus.OK,
                message: 'PDF uploaded successfully',
                data: {
                    filename: 'sample.pdf',
                    request_id: response.data.request_id,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to upload statement', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSummaryAndSave(requestId) {
        if (!requestId) {
            throw new common_1.HttpException('Request ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:9000/api/v1/statement/getExtractSummary', { request_id: requestId }));
            const data = response.data;
            const newStatement = this.statementRepo.create({
                requestId: requestId,
                accountNumber: data.account_number,
                accountHolderName: data.account_holder_name,
                totalCredit: data.total_credit,
                totalDebit: data.total_debit,
                closingBalance: data.closing_balance,
                rawResponse: data,
            });
            await this.statementRepo.save(newStatement);
            return {
                success: true,
                statusCode: common_1.HttpStatus.CREATED,
                message: 'Bank statement saved successfully',
                data: newStatement,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get summary', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOneStatement(requestId) {
        if (!requestId) {
            throw new common_1.HttpException('Request ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const statement = await this.statementRepo.findOne({
            where: { requestId },
        });
        if (!statement) {
            throw new common_1.HttpException('Statement not found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Statement fetched successfully',
            data: statement,
        };
    }
};
exports.StatementService = StatementService;
exports.StatementService = StatementService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(bank_statement_entity_1.BankStatement)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        typeorm_2.Repository])
], StatementService);
//# sourceMappingURL=statement.service.js.map