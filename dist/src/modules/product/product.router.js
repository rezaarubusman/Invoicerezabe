import { Router } from "express";
import { CreateProductDto, UpdateProductDto } from "./product.dto.js";
export class ProductRouter {
    productController;
    authMiddleware;
    validationMiddleware;
    router;
    constructor(productController, authMiddleware, validationMiddleware) {
        this.productController = productController;
        this.authMiddleware = authMiddleware;
        this.validationMiddleware = validationMiddleware;
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(CreateProductDto), this.productController.createProduct);
        this.router.get("/", this.authMiddleware.verifyToken, this.productController.getProducts);
        this.router.get("/:id", this.authMiddleware.verifyToken, this.productController.getProductById);
        this.router.patch("/:id", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(UpdateProductDto), this.productController.updateProduct);
        this.router.delete("/:id", this.authMiddleware.verifyToken, this.productController.deleteProduct);
    }
    getRouter = () => this.router;
}
