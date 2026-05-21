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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(jwtService, userService, userRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.STATIC_OTP = '189730';
    }
    async sendOtp(username, mobileNumber) {
        if (!mobileNumber) {
            throw new common_1.HttpException('Mobile number is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!username) {
            throw new common_1.HttpException('Username is required', common_1.HttpStatus.BAD_REQUEST);
        }
        let user = await this.userService.findOne({
            where: { mobileNumber },
        });
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 5);
        if (user) {
            user.otp = this.STATIC_OTP;
            user.otpExpiry = expiry;
            await this.userRepository.save(user);
        }
        else {
            user = await this.userService.create({
                mobileNumber,
                name: username,
                password: undefined,
                otp: this.STATIC_OTP,
                otpExpiry: expiry,
                isVerified: false,
            });
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'OTP sent successfully',
            data: {
                otp: this.STATIC_OTP,
                expiresAt: expiry,
            },
        };
    }
    async verifyOtp(mobileNumber, otp) {
        const user = await this.userService.findOne({ where: { mobileNumber } });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (user.otp !== otp)
            throw new common_1.HttpException('Incorrect OTP', common_1.HttpStatus.BAD_REQUEST);
        if (new Date() > user.otpExpiry)
            throw new common_1.HttpException('OTP expired', common_1.HttpStatus.BAD_REQUEST);
        user.isVerified = true;
        await this.userRepository.save(user);
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            data: {
                message: 'OTP verified successfully',
            },
        };
    }
    hashPassword(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }
    async register(body) {
        const hashedPassword = crypto
            .createHash('md5')
            .update(body.password)
            .digest('hex');
        const { mobileNumber } = body;
        const user = await this.userService.findOne({
            where: { mobileNumber },
        });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (!user.isVerified)
            throw new common_1.HttpException('OTP not verified', common_1.HttpStatus.BAD_REQUEST);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return {
            success: true,
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Registration successful',
            data: {
                mobileNumber: user.mobileNumber,
            },
        };
    }
    async login(mobileNumber, password) {
        const user = await this.userService.findOne({ where: { mobileNumber } });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const hashedInputPassword = crypto
            .createHash('md5')
            .update(password)
            .digest('hex');
        if (user.password !== hashedInputPassword)
            throw new common_1.HttpException('Invalid password', common_1.HttpStatus.UNAUTHORIZED);
        const payload = {
            userId: user.id,
            mobileNumber: user.mobileNumber,
        };
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Login successful',
            data: {
                access_token: this.jwtService.sign(payload),
                userId: user.id,
                name: user.name,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_service_1.UserService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map