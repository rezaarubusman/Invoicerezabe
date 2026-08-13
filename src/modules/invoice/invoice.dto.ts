import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { InvoiceStatus, RecurringInterval, RecurringStatus } from "@prisma/client";

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
  unitPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  tax?: number;
}

export class CreateInvoiceDto {
  @IsString()
  @MinLength(3)
  number!: string; 

  @IsUUID()
  clientId!: string;

  @IsDateString()
  dueDate!: string;

  @IsString()
  @MinLength(1)
  currency!: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  terms?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(RecurringStatus)
  recurringStatus?: RecurringStatus;
}

export class UpdateInvoiceDto {
  @IsOptional() 
  @IsString()
  @MinLength(3)
  number?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  currency!: string;

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

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(RecurringStatus)
  recurringStatus?: RecurringStatus
}

export class UpdateInvoiceStatusDto {
  @IsEnum(InvoiceStatus)
  status!: InvoiceStatus;

  @ValidateIf((o) => o.status === InvoiceStatus.PAID)
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ValidateIf((o) => o.status === InvoiceStatus.PAID)
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ValidateIf((o) => o.status === InvoiceStatus.PAID)
  @IsOptional()
  @IsNumber()
  amountPaid?: number;
}