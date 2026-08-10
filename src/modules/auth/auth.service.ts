import argon2 from "argon2";
import { randomUUID } from "crypto";
import type { PrismaClient } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { generateAccessToken } from "../../lib/jwt.js";
import type { RegisterDto, LoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.dto.js";

export class AuthService {
  constructor( private prisma: PrismaClient ) {}

  register = async (dto: RegisterDto) => {
  const { name, email, password } = dto;
  const normalizedEmail =
    email.trim().toLowerCase();
  const existingUser =
    await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

  if (existingUser) {
    throw new ApiError( "Email is already registered", 409 );
  }
  const hashedPassword =
    await argon2.hash(password);
  const verificationToken =
    randomUUID();
  const verificationTokenExpiresAt =
    new Date(
      Date.now() +
        24 * 60 * 60 * 1000
    );
  const user =
    await this.prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

  return {
    message: "Registration successful. Please verify your email.", user };
  };

  login = async (dto: LoginDto) => {
    const { email, password } = dto;
    const normalizedEmail =
        email.trim().toLowerCase();
    const user =
        await this.prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
        });

    if (!user) {
        throw new ApiError( "Invalid email or password", 401 );
    }

    const isPasswordValid =
        await argon2.verify(
        user.password,
        password
        );

    if (!isPasswordValid) {
        throw new ApiError(
        "Invalid email or password",
        401
        );
    }

    /*
    if (!user.isEmailVerified) {
        throw new ApiError(
        "Please verify your email first",
        403
        );
    }
    */

    const sessionId =
        randomUUID();

    await this.prisma.user.update({
        where: {
        id: user.id,
        },
        data: {
        activeSessionId: sessionId,
        },
    });

    const accessToken =
        generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sessionId,
        });

    return {
        message: "Login successful",
        accessToken,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified:
            user.isEmailVerified,
        },
        };
    };

  logout = async ( userId: string ) => {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        activeSessionId: null,
      },
    });

    return { message: "Logout successful" };
  };

  getCurrentUser = async ( userId: string ) => {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) { throw new ApiError( "User not found", 404 );}
    return user;
  };

  verifyEmail = async ( dto: VerifyEmailDto ) => {
    const { token } = dto;
    const user =
        await this.prisma.user.findFirst({
        where: {
            verificationToken: token,
        },
        });

    if (!user) {
        throw new ApiError( "Invalid verification token", 400 );
    }

    if (
        !user.verificationTokenExpiresAt ||
        user.verificationTokenExpiresAt < new Date()
    ) {
        throw new ApiError( "Verification token has expired", 400 );
    }

    await this.prisma.user.update({
        where: {
        id: user.id,
        },
        data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        },
    });

    return {
        message: "Email verified successfully" };
    };

  resendVerification = async ( dto: ResendVerificationDto ) => {
    const { email } = dto;
    const normalizedEmail =
        email.trim().toLowerCase();
    const user =
        await this.prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
        });

    if (!user) {
        return {
        message: "If the email exists, a verification email has been sent." };
    }

    if (user.isEmailVerified) {
        return {
        message: "Email is already verified." };
    }

    const verificationToken =
        randomUUID();
    const verificationTokenExpiresAt =
        new Date(
        Date.now() +
            24 * 60 * 60 * 1000
        );

    await this.prisma.user.update({
        where: {
        id: user.id,
        },
        data: {
        verificationToken,
        verificationTokenExpiresAt,
        },
    });

    return {
        message: "If the email exists, a verification email has been sent." };
    };

  forgotPassword = async ( dto: ForgotPasswordDto ) => {
    const { email } = dto;
    const normalizedEmail =
        email.trim().toLowerCase();
    const user =
        await this.prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
        });

    if (!user) {
        return {
        message: "If the email exists, a password reset email has been sent." };
    }

    const resetPasswordToken =
        randomUUID();
    const resetPasswordExpiresAt =
        new Date(
        Date.now() +
            15 * 60 * 1000
        );

    await this.prisma.user.update({
        where: {
        id: user.id,
        },
        data: {
        resetPasswordToken,
        resetPasswordExpiresAt,
        },
    });

    return {
        message: "If the email exists, a password reset email has been sent." };
    };

resetPassword = async ( dto: ResetPasswordDto ) => {
    const { token, password } = dto;
    const user =
        await this.prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
        },
        });

    if (!user) {
        throw new ApiError( "Invalid reset token", 400 );
    }

    if (
        !user.resetPasswordExpiresAt ||
        user.resetPasswordExpiresAt < new Date()
    ) {
        throw new ApiError( "Reset token has expired", 400 );
    }

    const hashedPassword =
        await argon2.hash(password);

    await this.prisma.user.update({
        where: {
        id: user.id,
        },
        data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
        activeSessionId: null,
        },
    });

    return {
        message: "Password reset successfully. Please login again."};
    };
}