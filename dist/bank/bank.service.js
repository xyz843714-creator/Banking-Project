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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankService = void 0;
const path_1 = require("path");
const fs = __importStar(require("fs"));
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const FormData = require('form-data');
let BankService = class BankService {
    async uploadStatement(file, bankCode) {
        try {
            if (!file) {
                throw new common_1.HttpException('File is required', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!bankCode) {
                throw new common_1.HttpException('Bank code is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const fd = new FormData();
            fd.append('file', file.buffer, file.originalname);
            fd.append('bankCode', bankCode);
            const response = await axios_1.default.post('http://localhost:9000/api/v1/statement/extractDataBank', fd, { headers: fd.getHeaders() });
            return {
                success: true,
                statusCode: common_1.HttpStatus.OK,
                message: 'PDF uploaded successfully',
                data: {
                    filename: file.originalname,
                    requestId: response.data.request_id,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to upload statement', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addTransaction(body, user) {
        if (!body) {
            throw new common_1.HttpException('Transaction data is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Transaction added successfully',
            data: {
                body,
                user,
            },
        };
    }
    async sendStatementPdf(res) {
        const filePath = (0, path_1.join)(process.cwd(), 'uploads', 'sample.pdf');
        if (!fs.existsSync(filePath)) {
            return res.status(common_1.HttpStatus.NOT_FOUND).json({
                success: false,
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: 'PDF file not found',
            });
        }
        return res.sendFile(filePath, {
            headers: { 'Content-Type': 'application/pdf' },
        });
    }
};
exports.BankService = BankService;
exports.BankService = BankService = __decorate([
    (0, common_1.Injectable)()
], BankService);
//# sourceMappingURL=bank.service.js.map