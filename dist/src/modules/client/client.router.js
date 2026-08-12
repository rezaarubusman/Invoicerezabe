import { Router } from "express";
import { CreateClientDto, UpdateClientDto } from "./client.dto.js";
export class ClientRouter {
    clientController;
    authMiddleware;
    validationMiddleware;
    router;
    constructor(clientController, authMiddleware, validationMiddleware) {
        this.clientController = clientController;
        this.authMiddleware = authMiddleware;
        this.validationMiddleware = validationMiddleware;
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(CreateClientDto), this.clientController.createClient);
        this.router.get("/", this.authMiddleware.verifyToken, this.clientController.getClients);
        this.router.get("/:id", this.authMiddleware.verifyToken, this.clientController.getClientById);
        this.router.patch("/:id", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(UpdateClientDto), this.clientController.updateClient);
        this.router.delete("/:id", this.authMiddleware.verifyToken, this.clientController.deleteClient);
    }
    getRouter = () => this.router;
}
