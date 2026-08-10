import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import type { RegisterDto, LoginDto, VerifyEmailDto, ResendVerificationDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.dto.js";

export class AuthController {
  constructor( private authService: AuthService ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body as RegisterDto;

      const result =
        await this.authService.register(
          name,
          email,
          password
        );

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
      const {
        email,
        password,
      } = req.body as LoginDto;

      const result =
        await this.authService.login(
          email,
          password
        );

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
      const { token } =
        req.body as VerifyEmailDto;

      const result =
        await this.authService.verifyEmail(
          token
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
      const { email } =
        req.body as ResendVerificationDto;

      const result =
        await this.authService.resendVerification(
          email
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
      const { email } =
        req.body as ForgotPasswordDto;

      const result =
        await this.authService.forgotPassword(
          email
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
      const {
        token,
        password,
      } = req.body as ResetPasswordDto;

      const result =
        await this.authService.resetPassword(
          token,
          password
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };
}