import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ApiError } from "../utils/api-error.js";
export class ValidationMiddleware {
    validateBody(dtoClass) {
        return async (req, _res, next) => {
            if (!req.body) {
                return next(new ApiError("Request body is required", 400));
            }
            const dtoInstance = plainToInstance(dtoClass, req.body);
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints ?? {}))
                    .flat()
                    .join(", ");
                return next(new ApiError(message, 400));
            }
            req.body = dtoInstance;
            next();
        };
    }
    validateQuery(dtoClass) {
        return async (req, _res, next) => {
            const dtoInstance = plainToInstance(dtoClass, req.query);
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
                const message = errors
                    .map((error) => Object.values(error.constraints ?? {}))
                    .flat()
                    .join(", ");
                return next(new ApiError(message, 400));
            }
            Object.assign(req.query, dtoInstance);
            next();
        };
    }
}
