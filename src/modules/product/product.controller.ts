import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { ProductService } from "./product.service.js";
import type { CreateProductDto, UpdateProductDto } from "./product.dto.js";
import { getParamId } from "../../utils/get-param-id.js";

export class ProductController {
  constructor( private productService: ProductService ) {}

  createProduct = async (
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
        req.body as CreateProductDto;

      const product =
        await this.productService.createProduct(
          userId,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (
    _req: Request,
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

      const products =
        await this.productService.getProducts(
          userId
        );

      res.status(200).json({
        success: true,
        message:
          "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (
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

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {
        return next(
          new ApiError(
            "Invalid product ID",
            400
          )
        );
      }

      const product =
        await this.productService.getProductById(
          userId,
          id
        );

      res.status(200).json({
        success: true,
        message:
          "Product retrieved successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (
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

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {
        return next(
          new ApiError(
            "Invalid product ID",
            400
          )
        );
      }

      const data =
        req.body as UpdateProductDto;

      const product =
        await this.productService.updateProduct(
          userId,
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (
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

      const id = getParamId(req.params.id);

      if (!id || Array.isArray(id)) {
        return next(
          new ApiError(
            "Invalid product ID",
            400
          )
        );
      }

      const result =
        await this.productService.deleteProduct(
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