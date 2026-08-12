import { ApiError } from "../../utils/api-error.js";
import { getParamId } from "../../utils/get-param-id.js";
export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createProduct = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const data = req.body;
            const product = await this.productService.createProduct(userId, data);
            res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProducts = async (_req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const products = await this.productService.getProducts(userId);
            res.status(200).json({
                success: true,
                message: "Products retrieved successfully",
                data: products,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getProductById = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid product ID", 400));
            }
            const product = await this.productService.getProductById(userId, id);
            res.status(200).json({
                success: true,
                message: "Product retrieved successfully",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    };
    updateProduct = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid product ID", 400));
            }
            const data = req.body;
            const product = await this.productService.updateProduct(userId, id, data);
            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProduct = async (req, res, next) => {
        try {
            const userId = res.locals.existingUser?.id;
            if (!userId) {
                return next(new ApiError("Unauthorized", 401));
            }
            const id = getParamId(req.params.id);
            if (!id || Array.isArray(id)) {
                return next(new ApiError("Invalid product ID", 400));
            }
            const result = await this.productService.deleteProduct(userId, id);
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
