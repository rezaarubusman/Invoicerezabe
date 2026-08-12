import { Router } from "express";
import type { AuthMiddleware } from "../../middlewares/auth.middleware.js";
import type { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { InvoiceController } from "./invoice.controller.js";
import { CreateInvoiceDto, UpdateInvoiceDto, UpdateInvoiceStatusDto } from "./invoice.dto.js";

export class InvoiceRouter {
  public router: Router;

  constructor(
    private invoiceController: InvoiceController,
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
        CreateInvoiceDto
      ),
      this.invoiceController.createInvoice
    );

    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.invoiceController.getInvoices
    );

    this.router.get(
      "/:id",
      this.authMiddleware.verifyToken,
      this.invoiceController.getInvoiceById
    );

    this.router.patch(
      "/:id",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        UpdateInvoiceDto
      ),
      this.invoiceController.updateInvoice
    );

    this.router.patch(
      "/:id/status",
      this.authMiddleware.verifyToken,
      this.validationMiddleware.validateBody(
        UpdateInvoiceStatusDto
      ),
      this.invoiceController.updateStatus
    );

    this.router.delete(
      "/:id",
      this.authMiddleware.verifyToken,
      this.invoiceController.deleteInvoice
    );
  }
  getRouter = () : Router => this.router;
}