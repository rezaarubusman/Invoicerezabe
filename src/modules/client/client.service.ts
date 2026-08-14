import type { PrismaClient, Prisma } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import type { CreateClientDto, UpdateClientDto } from "./client.dto.js";

export class ClientService {
  constructor(private prisma: PrismaClient) {}

  createClient = async ( userId: string, data: CreateClientDto ) => {
    const existingClient =
      await this.prisma.client.findFirst({
        where: {
          userId,
          email: data.email,
        },
      });

    if (existingClient) {
      throw new ApiError( "Client with this email already exists", 409 );
    }

    const client =
      await this.prisma.client.create({
        data: {
          userId,
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          paymentTerms: data.paymentTerms,
          notes: data.notes,
        },
      });

    return client;
  };

  getClients = async (
    userId: string,
    params: {
      search?: string;
      terms?: string;
      sortBy?: string;
      sortDir?: string;
      page?: number;
      limit?: number;
    }
  ) => {
    const {
      search,
      terms,
      sortBy = "createdAt",
      sortDir = "desc",
      page = 1,
      limit = 8, 
    } = params;

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ClientWhereInput = {
      userId,
      ...(terms && terms !== "all" && { paymentTerms: terms }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where: whereCondition,
        include: {
          invoices: {
            include: { items: true },
          },
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip,
        take: limit,
      }),
      this.prisma.client.count({ where: whereCondition }),
    ]);

    return {
      clients: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getClientById = async ( userId: string, clientId: string ) => {
    const client =
      await this.prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },

        include: {
          invoices: {
            include: { items: true },
            orderBy: { createdAt: 'desc'},
          }
        }
      });

    if (!client) {
      throw new ApiError( "Client not found", 404 );
    }

    return client;
  };

  updateClient = async ( userId: string, clientId: string, data: UpdateClientDto ) => {
    const client =
      await this.prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

    if (!client) {
      throw new ApiError( "Client not found", 404 );
    }

    if (data.email) {
      const existingClient =
        await this.prisma.client.findFirst({
          where: {
            userId,
            email: data.email,
            NOT: { id: clientId },
          },
        });

      if (existingClient) {
        throw new ApiError( "Client with this email already exists", 409 );
      }
    }

    return this.prisma.client.update({
      where: { id: clientId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
  };

  deleteClient = async ( userId: string, clientId: string ) => {
    const client =
      await this.prisma.client.findFirst({
        where: {
          id: clientId,
          userId,
        },
      });

    if (!client) {
      throw new ApiError( "Client not found", 404 );
    }

    const invoiceCount =
      await this.prisma.invoice.count({
        where: { clientId },
      });

    if (invoiceCount > 0) {
      throw new ApiError( "Client cannot be deleted because it has invoices", 409 );
    }

    await this.prisma.client.delete({
      where: { id: clientId },
    });

    return { message: "Client deleted successfully" };
  };
}