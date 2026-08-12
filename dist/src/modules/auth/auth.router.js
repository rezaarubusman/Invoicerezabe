import { Router } from "express";
import { RegisterDto, LoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.dto.js";
export class AuthRouter {
    authController;
    validationMiddleware;
    authMiddleware;
    router;
    constructor(authController, validationMiddleware, authMiddleware) {
        this.authController = authController;
        this.validationMiddleware = validationMiddleware;
        this.authMiddleware = authMiddleware;
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/register", this.validationMiddleware.validateBody(RegisterDto), this.authController.register);
        this.router.post("/login", this.validationMiddleware.validateBody(LoginDto), this.authController.login);
        this.router.post("/verify-email", this.validationMiddleware.validateBody(VerifyEmailDto), this.authController.verifyEmail);
        this.router.post("/resend-verification", this.validationMiddleware.validateBody(ResendVerificationDto), this.authController.resendVerification);
        this.router.post("/forgot-password", this.validationMiddleware.validateBody(ForgotPasswordDto), this.authController.forgotPassword);
        this.router.post("/reset-password", this.validationMiddleware.validateBody(ResetPasswordDto), this.authController.resetPassword);
        this.router.patch("/change-password", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(ChangePasswordDto), this.authController.changePassword);
        this.router.get("/me", this.authMiddleware.verifyToken, this.authController.me);
        this.router.post("/logout", this.authMiddleware.verifyToken, this.authController.logout);
    }
    getRouter = () => this.router;
}
