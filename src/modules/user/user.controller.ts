import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { UserService } from "./user.service.js";
import type { UpdateProfileDto, UpdateBusinessProfileDto, UpdateInvoiceSettingsDto } from "./user.dto.js";

export class UserController {
  // Inject langsung melalui modifier private pada parameter constructor
  constructor(private userService: UserService) {}

  getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {
        return next(new ApiError("Unauthorized", 401));
      }

      const settings = await this.userService.getSettings(userId);

      res.status(200).json({
        success: true,
        message: "Settings retrieved successfully",
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {
        return next(new ApiError("Unauthorized", 401));
      }

      const data = req.body as UpdateProfileDto;

      const user = await this.userService.updateProfile(userId, data);

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  updateBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {
        return next(new ApiError("Unauthorized", 401));
      }

      const data = req.body as UpdateBusinessProfileDto;

      const business = await this.userService.updateBusinessProfile(
        userId,
        data,
        req.file
      );

      res.status(200).json({
        success: true,
        message: "Business profile updated successfully",
        data: business,
      });
    } catch (error) {
      next(error);
    }
  };

  updateInvoiceSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {
        return next(new ApiError("Unauthorized", 401));
      }

      const data = req.body as UpdateInvoiceSettingsDto;

      const settings = await this.userService.updateInvoiceSettings(
        userId,
        data
      );

      res.status(200).json({
        success: true,
        message: "Invoice settings updated successfully",
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };
}