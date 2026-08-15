import { Router } from "express";
import multer from "multer";
import type { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import type { ValidationMiddleware } from "../../middlewares/validation.middleware.js"; 
import { UserController } from "./user.controller.js";
import { UpdateProfileDto, UpdateBusinessProfileDto, UpdateInvoiceSettingsDto } from "./user.dto.js";

export class UserRouter {
  public router: Router;

  private upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
  });

  constructor(
    private userController: UserController,
    private authMiddleware: AuthMiddleware,
    private validationMiddleware: ValidationMiddleware
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/settings",
      this.authMiddleware.verifyToken,
      this.userController.getSettings
    );

    this.router.patch(
      "/profile",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(UpdateProfileDto),
      this.userController.updateProfile
    );

    this.router.patch(
      "/business",
      this.authMiddleware.verifyToken,
      this.upload.single("logo"), 
      this.validationMiddleware.validateBody(UpdateBusinessProfileDto),
      this.userController.updateBusiness
    );

    this.router.patch(
      "/invoice-settings",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(UpdateInvoiceSettingsDto),
      this.userController.updateInvoiceSettings
    );
  }

  getRouter = (): Router => this.router;
}