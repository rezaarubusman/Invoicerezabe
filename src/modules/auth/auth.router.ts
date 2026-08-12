import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { RegisterDto, LoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.dto.js";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { AuthMiddleware } from "../../middlewares/auth.middleware.js";

export class AuthRouter {
  public router: Router;

  constructor(
    private authController: AuthController,
    private validationMiddleware: ValidationMiddleware,
    private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      this.validationMiddleware.validateBody(RegisterDto),
      this.authController.register
    );

    this.router.post(
      "/login",
      this.validationMiddleware.validateBody(LoginDto),
      this.authController.login
    );

    this.router.post(
      "/verify-email",
      this.validationMiddleware.validateBody(
        VerifyEmailDto
      ),
      this.authController.verifyEmail
    );

    this.router.post(
      "/resend-verification",
      this.validationMiddleware.validateBody(
        ResendVerificationDto
      ),
      this.authController.resendVerification
    );

    this.router.post(
      "/forgot-password",
      this.validationMiddleware.validateBody(
        ForgotPasswordDto
      ),
      this.authController.forgotPassword
    );

    this.router.post(
      "/reset-password",
      this.validationMiddleware.validateBody(
        ResetPasswordDto
      ),
      this.authController.resetPassword
    );

    this.router.patch(
      "/change-password",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        ChangePasswordDto
      ),
      this.authController.changePassword
    );

    this.router.get(
      "/me",
      this.authMiddleware.verifyToken,
      this.authController.me
    );

    this.router.post(
      "/logout",
      this.authMiddleware.verifyToken,
      this.authController.logout
    );
  }
  getRouter = (): Router => this.router;
}
