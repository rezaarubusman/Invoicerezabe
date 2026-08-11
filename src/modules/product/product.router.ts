import { Router } from "express";
import type { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import type { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { ProductController } from "./product.controller.js";
import { CreateProductDto, UpdateProductDto } from "./product.dto.js";

export class ProductRouter {
  public router: Router;

  constructor(
    private productController: ProductController,
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
        CreateProductDto
      ),
      this.productController.createProduct
    );

    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.productController.getProducts
    );

    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken,
      this.productController.getProductById
    );

    this.router.patch(
      "/:id",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        UpdateProductDto
      ),
      this.productController.updateProduct
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.productController.deleteProduct
    );
  }
  getRouter = () : Router => this.router;
}