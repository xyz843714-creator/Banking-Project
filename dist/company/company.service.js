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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./company.entity");
const user_entity_1 = require("../user/user.entity");
let CompanyService = class CompanyService {
    constructor(companyRepository, userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }
    async add(mobileNumber, name, salary) {
        if (salary < 10000) {
            throw new common_1.BadRequestException('Salary must be 10000 or above');
        }
        const company = this.companyRepository.create({
            companyName: name,
            salary,
            userMobile: mobileNumber,
        });
        await this.companyRepository.save(company);
        await this.userRepository.update({ mobileNumber }, {
            companyName: name,
            salary: salary,
        });
        return {
            success: true,
            data: {
                message: 'Company added successfully',
            },
        };
    }
    async get(mobileNumber) {
        const company = await this.companyRepository.findOne({
            where: { userMobile: mobileNumber },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return {
            success: true,
            message: 'Company fetched successfully',
            data: company,
        };
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CompanyService);
//# sourceMappingURL=company.service.js.map