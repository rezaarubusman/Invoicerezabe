var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InvoiceStatus, RecurringInterval } from "@prisma/client";
export class CreateInvoiceItemDto {
    productId;
    name;
    description;
    quantity;
    price;
}
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "productId", void 0);
__decorate([
    ValidateIf((object) => !object.productId),
    IsString(),
    MinLength(1),
    MaxLength(200),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    IsInt(),
    Min(1),
    Max(1000000),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    ValidateIf((object) => !object.productId),
    IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with maximum 2 decimal places" }),
    Min(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "price", void 0);
export class CreateInvoiceDto {
    clientId;
    dueDate;
    paymentTerms;
    isRecurring;
    recurringInterval;
    nextRecurringDate;
    items;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "clientId", void 0);
__decorate([
    IsDateString(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "paymentTerms", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateInvoiceDto.prototype, "isRecurring", void 0);
__decorate([
    ValidateIf((object) => object.isRecurring === true),
    IsEnum(RecurringInterval),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "recurringInterval", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "nextRecurringDate", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
export class UpdateInvoiceDto {
    clientId;
    dueDate;
    paymentTerms;
    isRecurring;
    recurringInterval;
    nextRecurringDate;
    items;
}
__decorate([
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "clientId", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "paymentTerms", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateInvoiceDto.prototype, "isRecurring", void 0);
__decorate([
    ValidateIf((object) => object.isRecurring === true),
    IsEnum(RecurringInterval),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "recurringInterval", void 0);
__decorate([
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "nextRecurringDate", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "items", void 0);
export class UpdateInvoiceStatusDto {
    status;
}
__decorate([
    IsEnum(InvoiceStatus),
    __metadata("design:type", String)
], UpdateInvoiceStatusDto.prototype, "status", void 0);
