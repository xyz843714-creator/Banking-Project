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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const admin_entity_1 = require("./entities/admin.entity");
const user_entity_1 = require("../user/user.entity");
const crypto = __importStar(require("crypto"));
let AdminService = class AdminService {
    constructor(adminRepo, userRepo, jwtService) {
        this.adminRepo = adminRepo;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async signup(email, password) {
        const existing = await this.adminRepo.findOne({ where: { email } });
        if (existing) {
            throw new common_1.HttpException('Admin already exists', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = crypto
            .createHash('md5')
            .update(password)
            .digest('hex');
        const admin = this.adminRepo.create({ email, password: hashedPassword });
        await this.adminRepo.save(admin);
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Admin registered successfully',
            data: {
                email: admin.email,
            },
        };
    }
    async login(email, password) {
        const admin = await this.adminRepo.findOne({ where: { email } });
        if (!admin) {
            throw new common_1.HttpException('Admin not found', common_1.HttpStatus.NOT_FOUND);
        }
        const hashedInputPassword = crypto
            .createHash('md5')
            .update(password)
            .digest('hex');
        if (admin.password !== hashedInputPassword) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = this.jwtService.sign({ id: admin.id, email: admin.email });
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: {
                token,
            },
        };
    }
    async approveEmployment(userId, salary) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!salary) {
            throw new common_1.HttpException('Salary is required', common_1.HttpStatus.BAD_REQUEST);
        }
        user.isEmploymentApproved = true;
        user.salary = salary;
        await this.userRepo.save(user);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'User employment approved successfully',
            data: {
                userId,
                salary,
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admin.service.js.map