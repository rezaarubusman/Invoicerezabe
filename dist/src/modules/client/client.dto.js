var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
export class CreateClientDto {
    name;
    email;
    phone;
    address;
    paymentPreference;
}
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(30),
    __metadata("design:type", String)
], CreateClientDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateClientDto.prototype, "paymentPreference", void 0);
export class UpdateClientDto {
    name;
    email;
    phone;
    address;
    paymentPreference;
}
__decorate([
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsEmail(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(30),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "paymentPreference", void 0);
export class ClientIdDto {
    id;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], ClientIdDto.prototype, "id", void 0);
