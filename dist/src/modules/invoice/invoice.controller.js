import { ApiError } from "../../utils/api-error.js";
import { getParamId } from "../../utils/get-param-id.js";
export class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    createInvoice = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const data = req.body;
            const invoice = await this.invoiceService.createInvoice(userId, data);
            res.status(201).json({
                success: true,
                message: "Invoice created successfully",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getInvoices = async (_req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const invoices = await this.invoiceService.getInvoices(userId);
            res.status(200).json({
                success: true,
                message: "Invoices retrieved successfully",
                data: invoices,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getInvoiceById = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid invoice ID", 400));
            }
            const invoice = await this.invoiceService.getInvoiceById(userId, id);
            res.status(200).json({
                success: true,
                message: "Invoice retrieved successfully",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateInvoice = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid invoice ID", 400));
            }
            const data = req.body;
            const invoice = await this.invoiceService.updateInvoice(userId, id, data);
            res.status(200).json({
                success: true,
                message: "Invoice updated successfully",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid invoice ID", 400));
            }
            const { status } = req.body;
            const invoice = await this.invoiceService.updateStatus(userId, id, status);
            res.status(200).json({
                success: true,
                message: "Invoice status updated successfully",
                data: invoice,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteInvoice = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid invoice ID", 400));
            }
            const result = await this.invoiceService.deleteInvoice(userId, id);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
