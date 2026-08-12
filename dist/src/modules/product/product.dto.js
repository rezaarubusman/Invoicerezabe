var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";
export class CreateProductDto {
    name;
    description;
    price;
    categoryId;
}
__decorate([
    IsString(),
    MinLength(2),
    MaxLength(150),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with maximum 2 decimal places" }),
    Min(0, { message: "Price cannot be negative" }),
    Max(9999999999.99, { message: "Price is too large" }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
export class UpdateProductDto {
    name;
    description;
    price;
    categoryId;
}
__decorate([
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(150),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with maximum 2 decimal places" }),
    Min(0, { message: "Price cannot be negative" }),
    Max(9999999999.99, { message: "Price is too large" }),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", Object)
], UpdateProductDto.prototype, "categoryId", void 0);
