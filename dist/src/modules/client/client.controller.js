import { ApiError } from "../../utils/api-error.js";
import { getParamId } from "../../utils/get-param-id.js";
export class ClientController {
    clientService;
    constructor(clientService) {
        this.clientService = clientService;
    }
    createClient = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const data = req.body;
            const client = await this.clientService.createClient(userId, data);
            res.status(201).json({
                success: true,
                message: "Client created successfully",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getClients = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const clients = await this.clientService.getClients(userId);
            res.status(200).json({
                success: true,
                message: "Clients retrieved successfully",
                data: clients,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getClientById = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Client ID is required", 400));
            }
            const client = await this.clientService.getClientById(userId, id);
            res.status(200).json({
                success: true,
                message: "Client retrieved successfully",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateClient = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Client ID is required", 400));
            }
            const data = req.body;
            const client = await this.clientService.updateClient(userId, id, data);
            res.status(200).json({
                success: true,
                message: "Client updated successfully",
                data: client,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteClient = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Client ID is required", 400));
            }
            const result = await this.clientService.deleteClient(userId, id);
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
