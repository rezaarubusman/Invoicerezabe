import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import type { CreateClientDto, UpdateClientDto } from "./client.dto.js";
import { ClientService } from "./client.service.js";

export class ClientController {
  constructor( private clientService: ClientService ) {}

  createClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        res.locals.existingUser?.id;

      if (!userId) {
        return next(
          new ApiError(
            "Unauthorized",
            401
          )
        );
      }

      const data =
        req.body as CreateClientDto;

      const client =
        await this.clientService.createClient(
          userId,
          data
        );

      res.status(201).json({
        success: true,
        message: "Client created successfully",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  };

  getClients = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        res.locals.existingUser?.id;

      if (!userId) {
        return next(
          new ApiError(
            "Unauthorized",
            401
          )
        );
      }

      const clients =
        await this.clientService.getClients(
          userId
        );

      res.status(200).json({
        success: true,
        message: "Clients retrieved successfully",
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  };

  getClientById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        res.locals.existingUser?.id;

      if (!userId) {
        return next(
          new ApiError(
            "Unauthorized",
            401
          )
        );
      }

      const { id } = req.params;

      if (!id) {
        return next(
          new ApiError(
            "Client ID is required",
            400
          )
        );
      }

      const client =
        await this.clientService.getClientById(
          userId,
          id as any
        );

      res.status(200).json({
        success: true,
        message: "Client retrieved successfully",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  };

  updateClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        res.locals.existingUser?.id;

      if (!userId) {
        return next(
          new ApiError(
            "Unauthorized",
            401
          )
        );
      }

      const { id } = req.params;

      if (!id) {
        return next(
          new ApiError(
            "Client ID is required",
            400
          )
        );
      }

      const data =
        req.body as UpdateClientDto;

      const client =
        await this.clientService.updateClient(
          userId,
          id as any,
          data
        );

      res.status(200).json({
        success: true,
        message: "Client updated successfully",
        data: client,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId =
        res.locals.existingUser?.id;

      if (!userId) {
        return next(
          new ApiError(
            "Unauthorized",
            401
          )
        );
      }

      const { id } = req.params;

      if (!id) {
        return next(
          new ApiError(
            "Client ID is required",
            400
          )
        );
      }

      const result =
        await this.clientService.deleteClient(
          userId,
          id as any
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