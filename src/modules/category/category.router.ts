import { Router } from "express";
import type { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import type { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { CategoryController } from "./category.controller.js";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";

export class CategoryRouter {
  public router: Router;

  constructor(
    private categoryController: CategoryController,
    private authMiddleware: AuthMiddleware,
    private validationMiddleware: ValidationMiddleware
  ) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        CreateCategoryDto
      ),
      this.categoryController.createCategory
    );

    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.categoryController.getCategories
    );

    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken,
      this.categoryController.getCategoryById
    );

    this.router.patch(
      "/:id",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        UpdateCategoryDto
      ),
      this.categoryController.updateCategory
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.categoryController.deleteCategory
    );
  }
  getRouter = () : Router => this.router;
}