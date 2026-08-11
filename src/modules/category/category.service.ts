import type { PrismaClient } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "./category.dto.js";

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  createCategory = async ( userId: string, data: CreateCategoryDto ) => {
    const existingCategory =
      await this.prisma.category.findFirst({
        where: {
          userId,
          name: data.name,
          deletedAt: null,
        },
      });

    if (existingCategory) {
      throw new ApiError( "Category with this name already exists", 409 );
    }

    const category =
      await this.prisma.category.create({
        data: {
          userId,
          name: data.name,
        },
      });

    return category;
  };

  getCategories = async ( userId: string ) => {
    return this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  getCategoryById = async ( userId: string, categoryId: string ) => {
    const category =
      await this.prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
          deletedAt: null,
        },
      });

    if (!category) {
      throw new ApiError( "Category not found", 404 );
    }

    return category;
  };

  updateCategory = async ( userId: string, categoryId: string, data: UpdateCategoryDto ) => {
    const category =
      await this.prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
          deletedAt: null,
        },
      });

    if (!category) {
      throw new ApiError( "Category not found", 404 );
    }

    if (data.name !== undefined) {
      const existingCategory =
        await this.prisma.category.findFirst({
          where: {
            userId,
            name: data.name,
            deletedAt: null,
            NOT: {
              id: categoryId,
            },
          },
        });

      if (existingCategory) {
        throw new ApiError( "Category with this name already exists", 409 );
      }
    }

    return this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
      },
    });
  };

  deleteCategory = async ( userId: string, categoryId: string ) => {
    const category =
      await this.prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
          deletedAt: null,
        },
      });

    if (!category) {
      throw new ApiError( "Category not found", 404 );
    }

    await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: "Category deleted successfully" };
  };
}