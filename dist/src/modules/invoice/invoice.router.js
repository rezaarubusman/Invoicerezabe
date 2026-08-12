import { Router } from "express";
import { CreateInvoiceDto, UpdateInvoiceDto, UpdateInvoiceStatusDto } from "./invoice.dto.js";
export class InvoiceRouter {
    invoiceController;
    authMiddleware;
    validationMiddleware;
    router;
    constructor(invoiceController, authMiddleware, validationMiddleware) {
        this.invoiceController = invoiceController;
        this.authMiddleware = authMiddleware;
        this.validationMiddleware = validationMiddleware;
        this.router = Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(CreateInvoiceDto), this.invoiceController.createInvoice);
        this.router.get("/", this.authMiddleware.verifyToken, this.invoiceController.getInvoices);
        this.router.get("/:id", this.authMiddleware.verifyToken, this.invoiceController.getInvoiceById);
        this.router.patch("/:id", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(UpdateInvoiceDto), this.invoiceController.updateInvoice);
        this.router.patch("/:id/status", this.authMiddleware.verifyToken, this.validationMiddleware.validateBody(UpdateInvoiceStatusDto), this.invoiceController.updateStatus);
        this.router.delete("/:id", this.authMiddleware.verifyToken, this.invoiceController.deleteInvoice);
    }
    getRouter = () => this.router;
}
