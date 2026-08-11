import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/api-error.js";
import { CategoryService } from "./category.service.js";
import type { CreateCategoryDto, UpdateCategoryDto} from "./category.dto.js";
import { getParamId } from "../../utils/get-param-id.js";

export class CategoryController {
  constructor( private categoryService: CategoryService ) {}

  createCategory = async (
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
        req.body as CreateCategoryDto;

      const category =
        await this.categoryService.createCategory(
          userId,
          data
        );

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (
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

      const categories =
        await this.categoryService.getCategories(
          userId
        );

      res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (
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

      if (!id) {
        return next(
          new ApiError(
            "Category ID is required",
            400
          )
        );
      }

      const category =
        await this.categoryService.getCategoryById(
          userId,
          id
        );

      res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (
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

      if (!id) {
        return next(
          new ApiError(
            "Category ID is required",
            400
          )
        );
      }

      const data =
        req.body as UpdateCategoryDto;

      const category =
        await this.categoryService.updateCategory(
          userId,
          id,
          data
        );

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (
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

      if (!id) {
        return next(
          new ApiError(
            "Category ID is required",
            400
          )
        );
      }

      const result =
        await this.categoryService.deleteCategory(
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