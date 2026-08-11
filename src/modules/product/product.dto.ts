import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a valid number with maximum 2 decimal places" })
  @Min(0, { message: "Price cannot be negative" })
  @Max(9999999999.99, { message: "Price is too large" })
  price!: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

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
  @IsUUID()
  categoryId?: string | null;
}