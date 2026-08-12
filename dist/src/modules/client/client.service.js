import { ApiError } from "../../utils/api-error.js";
export class ClientService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createClient = async (userId, data) => {
        const existingClient = await this.prisma.client.findFirst({
            where: {
                userId,
                email: data.email,
            },
        });
        if (existingClient) {
            throw new ApiError("Client with this email already exists", 409);
        }
        const client = await this.prisma.client.create({
            data: {
                userId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                paymentPreference: data.paymentPreference,
            },
        });
        return client;
    };
    getClients = async (userId) => {
        return this.prisma.client.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    };
    getClientById = async (userId, clientId) => {
        const client = await this.prisma.client.findFirst({
            where: {
                id: clientId,
                userId,
            },
        });
        if (!client) {
            throw new ApiError("Client not found", 404);
        }
        return client;
    };
    updateClient = async (userId, clientId, data) => {
        const client = await this.prisma.client.findFirst({
            where: {
                id: clientId,
                userId,
            },
        });
        if (!client) {
            throw new ApiError("Client not found", 404);
        }
        if (data.email) {
            const existingClient = await this.prisma.client.findFirst({
                where: {
                    userId,
                    email: data.email,
                    NOT: {
                        id: clientId,
                    },
                },
            });
            if (existingClient) {
                throw new ApiError("Client with this email already exists", 409);
            }
        }
        return this.prisma.client.update({
            where: {
                id: clientId,
            },
            data: {
                ...(data.name !== undefined && {
                    name: data.name,
                }),
                ...(data.email !== undefined && {
                    email: data.email,
                }),
                ...(data.phone !== undefined && {
                    phone: data.phone,
                }),
                ...(data.address !== undefined && {
                    address: data.address,
                }),
                ...(data.paymentPreference !== undefined && {
                    paymentPreference: data.paymentPreference,
                }),
            },
        });
    };
    deleteClient = async (userId, clientId) => {
        const client = await this.prisma.client.findFirst({
            where: {
                id: clientId,
                userId,
            },
        });
        if (!client) {
            throw new ApiError("Client not found", 404);
        }
        const invoiceCount = await this.prisma.invoice.count({
            where: {
                clientId,
            },
        });
        if (invoiceCount > 0) {
            throw new ApiError("Client cannot be deleted because it has invoices", 409);
        }
        await this.prisma.client.delete({
            where: {
                id: clientId,
            },
        });
        return { message: "Client deleted successfully" };
    };
}
