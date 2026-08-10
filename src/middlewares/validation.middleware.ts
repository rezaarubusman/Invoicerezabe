import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export class ValidationMiddleware {
  validateBody<T>(
    dtoClass: new () => T
  ) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      if (!req.body) {
        return next(
          new ApiError(
            "Request body is required",
            400
          )
        );
      }

      const dtoInstance =
        plainToInstance(
          dtoClass,
          req.body
        );

      const errors =
        await validate(
          dtoInstance as object
        );

      if (errors.length > 0) {
        const message =
          errors
            .map((error) =>
              Object.values(
                error.constraints ?? {}
              )
            )
            .flat()
            .join(", ");

        return next(
          new ApiError(
            message,
            400
          )
        );
      }

      req.body = dtoInstance;

      next();
    };
  }

  validateQuery<T>(
    dtoClass: new () => T
  ) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      const dtoInstance =
        plainToInstance(
          dtoClass,
          req.query
        );

      const errors =
        await validate(
          dtoInstance as object
        );

      if (errors.length > 0) {
        const message =
          errors
            .map((error) =>
              Object.values(
                error.constraints ?? {}
              )
            )
            .flat()
            .join(", ");

        return next(
          new ApiError(
            message,
            400
          )
        );
      }

      Object.assign(
        req.query,
        dtoInstance
      );

      next();
    };
  }
}