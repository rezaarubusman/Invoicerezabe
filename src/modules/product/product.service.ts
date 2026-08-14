import type { PrismaClient } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import type { CreateProductDto, UpdateProductDto } from "./product.dto.js";

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  createProduct = async ( userId: string, data: CreateProductDto ) => {
    if (data.categoryId) {
      const category =
        await this.prisma.category.findFirst({
          where: {
            id: data.categoryId,
            userId,
            deletedAt: null,
          },
        });

      if (!category) {
        throw new ApiError( "Category not found", 404 );
      }
    }

    const existingProduct =
      await this.prisma.product.findFirst({
        where: {
          userId,
          name: data.name,
          deletedAt: null,
        },
      });

    if (existingProduct) {
      throw new ApiError( "Product with this name already exists", 409 );
    }

    const product =
      await this.prisma.product.create({
        data: {
          userId,
          name: data.name,
          type: data.type === "product" ? "PRODUCT" : "SERVICE",
          description: data.description || "",
          price: data.price,
          unit: data.unit,
          tax: data.tax,
          status: data.status ? (data.status.toUpperCase() as any) : "ACTIVE",
          categoryId: data.categoryId,
        },
        include: { category: true },
      });

    return product;
  };

  getProducts = async ( 
    userId: string, 
    query: { search?: string; type?: string; status?: string; categoryId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; page?: number; limit?: number } 
  ) => {
    const { search, type, status, categoryId, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 8 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId, deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type && type !== 'all') where.type = type.toUpperCase();
    if (status && status !== 'all') where.status = status.toUpperCase();
    if (categoryId && categoryId !== 'all') where.categoryId = categoryId;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  };

  getProductById = async ( userId: string, productId: string ) => {
    const product =
      await this.prisma.product.findFirst({
        where: {
          id: productId,
          userId,
          deletedAt: null,
        },
        include: { category: true },
      });

    if (!product) {
      throw new ApiError( "Product not found", 404 );
    }

    return product;
  };

  updateProduct = async ( userId: string, productId: string, data: UpdateProductDto ) => {
    const product =
      await this.prisma.product.findFirst({
        where: {
          id: productId,
          userId,
          deletedAt: null,
        },
      });

    if (!product) {
      throw new ApiError( "Product not found", 404 );
    }

    if (data.categoryId !== undefined) {
      if (data.categoryId !== null) {
        const category =
          await this.prisma.category.findFirst({
            where: {
              id: data.categoryId,
              userId,
              deletedAt: null,
            },
          });

        if (!category) {
          throw new ApiError( "Category not found", 404 );
        }
      }
    }

    if (data.name !== undefined) {
      const existingProduct =
        await this.prisma.product.findFirst({
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
        throw new ApiError( "Product with this name already exists", 409 );
      }
    }

    const updatedProduct =
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.type !== undefined && { type: data.type === "product" ? "PRODUCT" : "SERVICE"}),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.unit !== undefined && { unit: data.unit}),
          ...(data.tax !== undefined && { tax: data.tax}),
          ...(data.status !== undefined && { status: data.status.toUpperCase() as any}),
          ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        },
        include: { category: true },
      });

    return updatedProduct;
  };

  deleteProduct = async ( userId: string, productId: string ) => {
    const product =
      await this.prisma.product.findFirst({
        where: {
          id: productId,
          userId,
          deletedAt: null,
        },
      });

    if (!product) {
      throw new ApiError( "Product not found", 404 );
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        status: "ARCHIVED",
        deletedAt: new Date(),
      },
    });

    return { message: "Product archived successfully" };
  };
}