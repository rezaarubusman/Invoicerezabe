import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, IsIn, ValidateIf } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @IsIn(["product", "service"])
  type!: "product" | "service";

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with maximum 2 decimal places" })
  @Min(0, { message: "Price cannot be negative" })
  @Max(9999999999.99, { message: "Price is too large" })
  price!: number;

  @IsString()
  @MaxLength(20)
  unit!: string;

  @IsNumber({maxDecimalPlaces: 2})
  @Min(0)
  @Max(100)
  tax!: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsIn(["active", "inactive", "archived"])
  status?: "active" | "inactive" | "archived";
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsIn(["product", "service"])
  type?: "product" | "service";

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "Price must be a valid number with maximum 2 decimal places" }
  )
  @Min(0, { message: "Price cannot be negative" })
  @Max(9999999999.99, { message: "Price is too large" })
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2})
  @Min(0)
  @Max(20)
  tax?: number;

  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsIn(["active", "inactive", "archived"])
  status?: "active" | "inactive" | "archived";
}