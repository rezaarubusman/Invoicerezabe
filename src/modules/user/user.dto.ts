import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2, { message: "Name must be at least 2 characters" })
  @MaxLength(80)
  name!: string;
}

export class UpdateInvoiceSettingsDto {
  @IsString()
  currency!: string;

  @IsString()
  defaultPaymentTerms!: string;

  @IsOptional()
  @IsString()
  defaultNotes?: string;

  @IsOptional()
  @IsString()
  defaultTerms?: string;

  @IsString()
  numberPrefix!: string;
}

export class UpdateBusinessProfileDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString() 
  website?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}