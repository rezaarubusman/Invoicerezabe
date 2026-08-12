import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { RegisterDto, LoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.dto.js";

export class AuthController {
  constructor( private authService: AuthService ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as RegisterDto;

      const result =
        await this.authService.register(dto);

      return res
        .status(201)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as LoginDto;

      const result =
        await this.authService.login(dto);

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user =
        res.locals.user;

      const result =
        await this.authService.logout(
          user.id
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user =
        res.locals.user;

      const result =
        await this.authService.getCurrentUser(
          user.id
        );

      return res
        .status(200)
        .json({
          user: result,
        });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as VerifyEmailDto;

      const result =
        await this.authService.verifyEmail(
          dto
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as ResendVerificationDto;

      const result =
        await this.authService.resendVerification(
          dto
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as ForgotPasswordDto;

      const result =
        await this.authService.forgotPassword(
          dto
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        req.body as ResetPasswordDto;

      const result =
        await this.authService.resetPassword(
          dto
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user =
        res.locals.user;

      const dto =
        req.body as ChangePasswordDto;

      const result =
        await this.authService.changePassword(
          user.id,
          dto
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };
}
