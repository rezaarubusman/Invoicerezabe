import argon2 from "argon2";
import { randomUUID } from "node:crypto";
import { ApiError } from "../../utils/api-error.js";
import { generateAccessToken } from "../../lib/jwt.js";
export class AuthService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    register = async (dto) => {
        const { name, email, password } = dto;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (existingUser) {
            throw new ApiError("Email is already registered", 409);
        }
        const hashedPassword = await argon2.hash(password);
        const verificationToken = randomUUID();
        const verificationTokenExpiresAt = new Date(Date.now() +
            24 * 60 * 60 * 1000);
        const user = await this.prisma.user.create({
            data: {
                name: normalizedName,
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
        const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
        const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`;
        try {
            await this.mailService.sendEmail(user.email, "Verify your Fakturia account", "verify-email", {
                name: user.name,
                verificationUrl,
            });
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
        }
        return {
            message: "Registration successful. Please check your email to verify your account.",
            user,
        };
    };
    login = async (dto) => {
        const { email, password } = dto;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            throw new ApiError("Invalid email or password", 401);
        }
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            throw new ApiError("Invalid email or password", 401);
        }
        if (!user.isEmailVerified) {
            throw new ApiError("Please verify your email first", 403);
        }
        const sessionId = randomUUID();
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                activeSessionId: sessionId,
            },
        });
        const accessToken = generateAccessToken({
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
                isEmailVerified: user.isEmailVerified,
            },
        };
    };
    logout = async (userId) => {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                activeSessionId: null,
            },
        });
        return {
            message: "Logout successful",
        };
    };
    getCurrentUser = async (userId) => {
        const user = await this.prisma.user.findUnique({
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
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    };
    verifyEmail = async (dto) => {
        const { token } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                verificationToken: token,
            },
        });
        if (!user) {
            throw new ApiError("Invalid verification token", 400);
        }
        if (!user.verificationTokenExpiresAt ||
            user.verificationTokenExpiresAt <
                new Date()) {
            throw new ApiError("Verification token has expired", 400);
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
            message: "Email verified successfully",
        };
    };
    resendVerification = async (dto) => {
        const { email } = dto;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return {
                message: "If the email exists, a verification email has been sent.",
            };
        }
        if (user.isEmailVerified) {
            return {
                message: "Email is already verified.",
            };
        }
        const verificationToken = randomUUID();
        const verificationTokenExpiresAt = new Date(Date.now() +
            24 * 60 * 60 * 1000);
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                verificationToken,
                verificationTokenExpiresAt,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL ??
            "http://localhost:5173";
        const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(verificationToken)}`;
        try {
            await this.mailService.sendEmail(user.email, "Verify your Fakturia account", "resend-verification", {
                name: user.name,
                verificationUrl,
            });
        }
        catch (error) {
            console.error("Failed to resend verification email:", error);
        }
        return {
            message: "If the email exists, a verification email has been sent.",
        };
    };
    forgotPassword = async (dto) => {
        const { email } = dto;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return {
                message: "If the email exists, a password reset email has been sent.",
            };
        }
        const resetPasswordToken = randomUUID();
        const resetPasswordExpiresAt = new Date(Date.now() +
            15 * 60 * 1000);
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                resetPasswordToken,
                resetPasswordExpiresAt,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL ??
            "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetPasswordToken)}`;
        try {
            await this.mailService.sendEmail(user.email, "Reset your Fakturia password", "forgot-password", {
                name: user.name,
                resetUrl,
            });
        }
        catch (error) {
            console.error("Failed to send password reset email:", error);
        }
        return {
            message: "If the email exists, a password reset email has been sent.",
        };
    };
    resetPassword = async (dto) => {
        const { token, password } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
            },
        });
        if (!user) {
            throw new ApiError("Invalid reset token", 400);
        }
        if (!user.resetPasswordExpiresAt ||
            user.resetPasswordExpiresAt <
                new Date()) {
            throw new ApiError("Reset token has expired", 400);
        }
        const hashedPassword = await argon2.hash(password);
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
        const frontendUrl = process.env.FRONTEND_URL ??
            "http://localhost:5173";
        const loginUrl = `${frontendUrl}/login`;
        try {
            await this.mailService.sendEmail(user.email, "Your Fakturia password was changed", "reset-password", {
                name: user.name,
                loginUrl,
            });
        }
        catch (error) {
            console.error("Failed to send password reset confirmation email:", error);
        }
        return {
            message: "Password reset successfully. Please login again.",
        };
    };
    changePassword = async (userId, dto) => {
        const { currentPassword, newPassword, } = dto;
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        const isCurrentPasswordValid = await argon2.verify(user.password, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new ApiError("Current password is incorrect", 400);
        }
        const isSamePassword = await argon2.verify(user.password, newPassword);
        if (isSamePassword) {
            throw new ApiError("New password must be different from current password", 400);
        }
        const hashedPassword = await argon2.hash(newPassword);
        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpiresAt: null,
            },
        });
        const frontendUrl = process.env.FRONTEND_URL ??
            "http://localhost:5173";
        try {
            await this.mailService.sendEmail(user.email, "Your Fakturia password was changed", "reset-password", {
                name: user.name,
                loginUrl: `${frontendUrl}/login`,
            });
        }
        catch (error) {
            console.error("Failed to send password change confirmation email:", error);
        }
        return {
            message: "Password changed successfully",
        };
    };
}
