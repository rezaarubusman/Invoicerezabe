import { Router } from "express";
import type { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import type { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { ClientController } from "./client.controller.js";
import { CreateClientDto, UpdateClientDto } from "./client.dto.js";

export class ClientRouter {
  public router: Router;

  constructor(
    private clientController: ClientController,
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
        CreateClientDto
      ),
      this.clientController.createClient
    );

    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.clientController.getClients
    );

    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken,
      this.clientController.getClientById
    );

    this.router.patch(
      "/:id",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        UpdateClientDto
      ),
      this.clientController.updateClient
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.clientController.deleteClient
    );
  }
  getRouter = (): Router => this.router;
}