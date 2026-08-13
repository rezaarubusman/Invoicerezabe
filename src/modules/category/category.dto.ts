import { IsOptional, IsString, MaxLength, MinLength, IsIn } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(["active", "archived"])
  status?: "active" | "archived"
}