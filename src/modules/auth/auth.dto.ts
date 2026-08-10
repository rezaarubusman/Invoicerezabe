import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  token!: string;
}

export class ResendVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}