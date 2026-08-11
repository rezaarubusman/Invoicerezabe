import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InvoiceStatus, RecurringInterval } from "@prisma/client";

export class CreateInvoiceItemDto {
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ValidateIf((object) => !object.productId)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsInt()
  @Min(1)
  @Max(1000000)
  quantity!: number;

  @ValidateIf((object) => !object.productId)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Price must be a valid number with maximum 2 decimal places" }
  )
  @Min(0)
  price?: number;
}

export class CreateInvoiceDto {
  @IsUUID()
  clientId!: string;

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  paymentTerms?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ValidateIf((object) => object.isRecurring === true)
  @IsEnum(RecurringInterval)
  recurringInterval?: RecurringInterval;

  @IsOptional()
  @IsDateString()
  nextRecurringDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  paymentTerms?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ValidateIf((object) => object.isRecurring === true)
  @IsEnum(RecurringInterval)
  recurringInterval?: RecurringInterval;

  @IsOptional()
  @IsDateString()
  nextRecurringDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items?: CreateInvoiceItemDto[];
}

export class UpdateInvoiceStatusDto {
  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;
}