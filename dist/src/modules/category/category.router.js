import { Router } from "express";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";
export class CategoryRouter {
    categoryController;
    authMiddleware;
    validationMiddleware;
    router;
    constructor(categoryController, authMiddleware, validationMiddleware) {
        this.categoryController = categoryController;
        this.authMiddleware = authMiddleware;
        this.validationMiddleware = validationMiddleware;
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(CreateCategoryDto), this.categoryController.createCategory);
        this.router.get("/", this.authMiddleware.verifyToken, this.categoryController.getCategories);
        this.router.get("/:id", this.authMiddleware.verifyToken, this.categoryController.getCategoryById);
        this.router.patch("/:id", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(UpdateCategoryDto), this.categoryController.updateCategory);
        this.router.delete("/:id", this.authMiddleware.verifyToken, this.categoryController.deleteCategory);
    }
    getRouter = () => this.router;
}
