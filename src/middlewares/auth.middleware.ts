import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { PrismaClient, Role } from "@prisma/client";
import { ApiError } from "../utils/api-error.js";
import type { JwtPayload } from "../lib/jwt.js";

export class AuthMiddleware {
  constructor( private prisma: PrismaClient ) {}

  verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return next(
        new ApiError(
          "No token provided",
          401
        )
      );
    }

    const token =
      authHeader.substring(7);

    if (!token) {
      return next(
        new ApiError(
          "No token provided",
          401
        )
      );
    }

    try {
      const secret =
        process.env.JWT_ACCESS_SECRET;

      if (!secret) {
        throw new Error(
          "JWT_ACCESS_SECRET is not configured"
        );
      }

      const decoded =
        jwt.verify(
          token,
          secret
        );

      if (
        typeof decoded === "string"
      ) {
        return next(
          new ApiError(
            "Invalid token payload",
            401
          )
        );
      }

      if (
        typeof decoded.id !== "string" ||
        typeof decoded.email !== "string" ||
        typeof decoded.name !== "string" ||
        typeof decoded.role !== "string" ||
        typeof decoded.sessionId !== "string"
      ) {
        return next(
          new ApiError(
            "Invalid token payload",
            401
          )
        );
      }

      const payload =
        decoded as unknown as JwtPayload;

      const user =
        await this.prisma.user.findUnique({
          where: {
            id: payload.id,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            activeSessionId: true,
          },
        });

      if (!user) {
        return next(
          new ApiError(
            "User not found",
            401
          )
        );
      }
      
      if (
        !user.activeSessionId ||
        user.activeSessionId !==
          payload.sessionId
      ) {
        return next(
          new ApiError(
            "This session has expired or you are logged in on another device",
            401
          )
        );
      }
      res.locals.user = user;
      res.locals.existingUser =
        payload;

      next();
    } catch (error) {
      if (
        error instanceof
        jwt.TokenExpiredError
      ) {
        return next(
          new ApiError(
            "Token expired",
            401
          )
        );
      }

      if (
        error instanceof
        jwt.JsonWebTokenError
      ) {
        return next(
          new ApiError(
            "Token invalid",
            401
          )
        );
      }

      next(error);
    }
  };

  verifyRole = (
    ...roles: Role[]
  ) => {
    return (
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const userRole =
        res.locals.user?.role;

      if (
        !userRole ||
        !roles.includes(userRole)
      ) {
        return next(
          new ApiError(
            "You don't have access to this resource",
            403
          )
        );
      }

      next();
    };
  };
}