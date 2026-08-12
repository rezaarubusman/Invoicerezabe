import { ApiError } from "../../utils/api-error.js";
import { getParamId } from "../../utils/get-param-id.js";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    createCategory = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const data = req.body;
            const category = await this.categoryService.createCategory(userId, data);
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCategories = async (_req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const categories = await this.categoryService.getCategories(userId);
            res.status(200).json({
                success: true,
                message: "Categories retrieved successfully",
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getCategoryById = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Category ID is required", 400));
            }
            const category = await this.categoryService.getCategoryById(userId, id);
            res.status(200).json({
                success: true,
                message: "Category retrieved successfully",
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateCategory = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Category ID is required", 400));
            }
            const data = req.body;
            const category = await this.categoryService.updateCategory(userId, id, data);
            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteCategory = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id) {
                return next(new ApiError("Category ID is required", 400));
            }
            const result = await this.categoryService.deleteCategory(userId, id);
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
