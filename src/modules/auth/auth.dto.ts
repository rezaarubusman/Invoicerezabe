import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

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
  @Matches(/[A-Z]/, {
    message:
      "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message:
      "Password must contain at least one lowercase letter",
  })
  @Matches(/\d/, {
    message:
      "Password must contain at least one number",
  })
  @Matches(/[^A-Za-z0-9]/, {
    message:
      "Password must contain at least one special character",
  })
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
  @Matches(/[A-Z]/, {
    message:
      "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message:
      "Password must contain at least one lowercase letter",
  })
  @Matches(/\d/, {
    message:
      "Password must contain at least one number",
  })
  @Matches(/[^A-Za-z0-9]/, {
    message:
      "Password must contain at least one special character",
  })
  password!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, {
    message:
      "Password must contain at least one uppercase letter",
  })
  @Matches(/[a-z]/, {
    message:
      "Password must contain at least one lowercase letter",
  })
  @Matches(/\d/, {
    message:
      "Password must contain at least one number",
  })
  @Matches(/[^A-Za-z0-9]/, {
    message:
      "Password must contain at least one special character",
  })
  newPassword!: string;
}