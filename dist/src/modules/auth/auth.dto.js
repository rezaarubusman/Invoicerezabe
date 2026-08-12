var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator";
export class RegisterDto {
    name;
    email;
    password;
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    MinLength(8),
    Matches(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    }),
    Matches(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    }),
    Matches(/\d/, {
        message: "Password must contain at least one number",
    }),
    Matches(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
export class LoginDto {
    email;
    password;
}
__decorate([
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
export class VerifyEmailDto {
    token;
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
export class ResendVerificationDto {
    email;
}
__decorate([
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], ResendVerificationDto.prototype, "email", void 0);
export class ForgotPasswordDto {
    email;
}
__decorate([
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
export class ResetPasswordDto {
    token;
    password;
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    MinLength(8),
    Matches(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    }),
    Matches(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    }),
    Matches(/\d/, {
        message: "Password must contain at least one number",
    }),
    Matches(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
export class ChangePasswordDto {
    currentPassword;
    newPassword;
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    MinLength(8),
    Matches(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    }),
    Matches(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    }),
    Matches(/\d/, {
        message: "Password must contain at least one number",
    }),
    Matches(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
