import { ApiError } from "../../utils/api-error.js";
export class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createProduct = async (userId, data) => {
        if (data.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: data.categoryId,
                    userId,
                    deletedAt: null,
                },
            });
            if (!category) {
                throw new ApiError("Category not found", 404);
            }
        }
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                userId,
                name: data.name,
                deletedAt: null,
            },
        });
        if (existingProduct) {
            throw new ApiError("Product with this name already exists", 409);
        }
        const product = await this.prisma.product.create({
            data: {
                userId,
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });
        return product;
    };
    getProducts = async (userId) => {
        return this.prisma.product.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    };
    getProductById = async (userId, productId) => {
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId,
                deletedAt: null,
            },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new ApiError("Product not found", 404);
        }
        return product;
    };
    updateProduct = async (userId, productId, data) => {
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId,
                deletedAt: null,
            },
        });
        if (!product) {
            throw new ApiError("Product not found", 404);
        }
        if (data.categoryId !== undefined) {
            if (data.categoryId !== null) {
                const category = await this.prisma.category.findFirst({
                    where: {
                        id: data.categoryId,
                        userId,
                        deletedAt: null,
                    },
                });
                if (!category) {
                    throw new ApiError("Category not found", 404);
                }
            }
        }
        if (data.name !== undefined) {
            const existingProduct = await this.prisma.product.findFirst({
                where: {
                    userId,
                    name: data.name,
                    deletedAt: null,
                    NOT: {
                        id: productId,
                    },
                },
            });
            if (existingProduct) {
                throw new ApiError("Product with this name already exists", 409);
            }
        }
        const updatedProduct = await this.prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                ...(data.name !== undefined && {
                    name: data.name,
                }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.price !== undefined && {
                    price: data.price,
                }),
                ...(data.categoryId !== undefined && {
                    categoryId: data.categoryId,
                }),
            },
            include: {
                category: true,
            },
        });
        return updatedProduct;
    };
    deleteProduct = async (userId, productId) => {
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId,
                deletedAt: null,
            },
        });
        if (!product) {
            throw new ApiError("Product not found", 404);
        }
        await this.prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        return { message: "Product deleted successfully" };
    };
}
