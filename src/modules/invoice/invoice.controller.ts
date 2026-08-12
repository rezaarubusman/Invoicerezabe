import type { NextFunction, Request, Response } from "express";
import { InvoiceStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import { InvoiceService } from "./invoice.service.js";
import type { CreateInvoiceDto, UpdateInvoiceDto, UpdateInvoiceStatusDto } from "./invoice.dto.js";
import { getParamId } from "../../utils/get-param-id.js";

export class InvoiceController {
  constructor( private invoiceService: InvoiceService ) {}

  createInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {return next(new ApiError( "Unauthorized", 401 ))}

      const data = req.body as CreateInvoiceDto;

      const invoice =
        await this.invoiceService.createInvoice(
          userId,
          data
        );

      res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  };

  getInvoices = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
      try {
        const userId = res.locals.existingUser?.id;
        if (!userId) return next(new ApiError("Unauthorized", 401));

        let isRecurringFilter: boolean | undefined = undefined;
        if (req.query.isRecurring === 'true') isRecurringFilter = true;
        if (req.query.isRecurring === 'false') isRecurringFilter = false;

        const invoices = await this.invoiceService.getInvoices(
          userId,
          isRecurringFilter
        );

        res.status(200).json({
          success: true,
          message: "Invoices retrieved successfully",
          data: invoices,
        });
      } catch (error) {
        next(error);
      }
  };

  getInvoiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {return next( new ApiError( "Unauthorized", 401 ))}

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {return next(new ApiError( "Invalid invoice ID", 400 ))}

      const invoice =
        await this.invoiceService.getInvoiceById(
          userId,
          id
        );

      res.status(200).json({
        success: true,
        message: "Invoice retrieved successfully",
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  };

  updateInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {return next(new ApiError( "Unauthorized", 401 ))}

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {return next(new ApiError( "Invalid invoice ID", 400 ))}

      const data =
        req.body as UpdateInvoiceDto;

      const invoice =
        await this.invoiceService.updateInvoice(
          userId,
          id,
          data
        );

      res.status(200).json({
        success: true,
        message: "Invoice updated successfully",
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
      try {
        const userId = res.locals.existingUser?.id;
        if (!userId) return next(new ApiError("Unauthorized", 401));
        
        const id = getParamId(req.params.id);
        if (!id || Array.isArray(id)) return next(new ApiError("Invalid invoice ID", 400));

        const { status, paymentMethod, paymentReference, amountPaid } = req.body as UpdateInvoiceStatusDto;

        const invoice = await this.invoiceService.updateStatus(
          userId,
          id,
          status,
          { paymentMethod, paymentReference, amountPaid } // Teruskan data payment
        );

        res.status(200).json({
          success: true,
          message: "Invoice status updated successfully",
          data: invoice,
        });
      } catch (error) {
        next(error);
    }
  };

  deleteInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.existingUser?.id;

      if (!userId) {return next(new ApiError( "Unauthorized", 401 ))}

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {return next(new ApiError( "Invalid invoice ID", 400 ))}

      const result =
        await this.invoiceService.deleteInvoice(
          userId,
          id
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
}