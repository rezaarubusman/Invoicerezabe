import cors from "cors";
import express from "express";
import { corsOptions } from "./config/cors.js";
import { loggerHttp } from "./lib/logger-http.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware.js";
import { prisma } from "./lib/prisma.js";
import { AuthMiddleware } from "./middlewares/auth.middleware.js";
import { UploadMiddleware } from "./middlewares/upload.middleware.js";
import { ValidationMiddleware } from "./middlewares/validation.middleware.js";
import { AuthController } from "./modules/auth/auth.controller.js";
import { AuthRouter } from "./modules/auth/auth.router.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { CloudinaryService } from "./modules/cloudinary/cloudinary.service.js";
import { ClientService } from "./modules/client/client.service.js";
import { ClientController } from "./modules/client/client.controller.js";
import { ClientRouter } from "./modules/client/client.router.js";
import { CategoryService } from "./modules/category/category.service.js";
import { CategoryController } from "./modules/category/category.controller.js";
import { CategoryRouter } from "./modules/category/category.router.js";
import { ProductService } from "./modules/product/product.service.js";
import { ProductController } from "./modules/product/product.controller.js";
import { ProductRouter } from "./modules/product/product.router.js";

const PORT = 8000;

export class App {
  app: express.Express;

  constructor() {
    this.app = express();
    this.configure();
    this.registerModules();
    this.handleError();
  }

  private configure = () => {
    this.app.use(cors(corsOptions));
    this.app.use(loggerHttp);
    this.app.use(express.json());
  };

  private registerModules = () => {
    const prismaClient = prisma;

    const authMiddleware = new AuthMiddleware(prismaClient);
    const validationMiddleware = new ValidationMiddleware();
    const uploadMiddleware = new UploadMiddleware();
    const cloudinaryService = new CloudinaryService();

    const authService = new AuthService(prismaClient);
    const authController = new AuthController(authService);
    const authRouter = new AuthRouter(authController, validationMiddleware, authMiddleware);

    const clientService = new ClientService(prismaClient);
    const clientController = new ClientController(clientService);
    const clientRouter = new ClientRouter(clientController, authMiddleware, validationMiddleware);

    const categoryService = new CategoryService(prismaClient);
    const categoryController = new CategoryController(categoryService);
    const categoryRouter = new CategoryRouter(categoryController, authMiddleware, validationMiddleware);

    const productService = new ProductService(prismaClient);
    const productController = new ProductController(productService);
    const productRouter = new ProductRouter(productController, authMiddleware, validationMiddleware)

    this.app.use(
      "/auth",
      authRouter.getRouter()
    );

    this.app.use(
      "/client",
      clientRouter.getRouter()
    );

    this.app.use(
      "/category",
      categoryRouter.getRouter()
    )

    this.app.use(
      "/product",
      productRouter.getRouter()
    )
  };

  private handleError = () => {
    this.app.use(errorMiddleware);
    this.app.use(notFoundMiddleware);
  };

  start() {
    this.app.listen(PORT, () => {
      console.log(`Server Running On Port : ${PORT}`);
    });
  }
}
