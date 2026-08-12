import { InvoiceStatus, RecurringInterval } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
export class InvoiceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateInvoiceNumber = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const random = Math.floor(100000 + Math.random() * 900000);
        return `INV-${year}${month}${day}-${random}`;
    };
    calculateItemTotal = (price, quantity) => {
        return price * quantity;
    };
    prepareInvoiceItems = async (tx, userId, items) => {
        if (!items || items.length === 0) {
            throw new ApiError("Invoice must contain at least one item", 400);
        }
        return Promise.all(items.map(async (item) => {
            if (item.productId) {
                const product = await tx.product.findFirst({
                    where: {
                        id: item.productId,
                        userId,
                        deletedAt: null,
                    },
                });
                if (!product) {
                    throw new ApiError(`Product ${item.productId} not found`, 404);
                }
                return {
                    productId: product.id,
                    name: product.name,
                    description: item.description ??
                        product.description,
                    quantity: item.quantity,
                    price: product.price,
                };
            }
            if (!item.name ||
                item.price === undefined) {
                throw new ApiError("Custom invoice item requires name and price", 400);
            }
            return {
                productId: null,
                name: item.name,
                description: item.description ?? null,
                quantity: item.quantity,
                price: item.price,
            };
        }));
    };
    createInvoice = async (userId, data) => {
        return this.prisma.$transaction(async (tx) => {
            const client = await tx.client.findFirst({
                where: {
                    id: data.clientId,
                    userId,
                },
            });
            if (!client) {
                throw new ApiError("Client not found", 404);
            }
            if (data.isRecurring === true &&
                !data.recurringInterval) {
                throw new ApiError("Recurring interval is required for recurring invoice", 400);
            }
            let invoiceNumber = this.generateInvoiceNumber();
            while (await tx.invoice.findUnique({
                where: {
                    invoiceNumber,
                },
            })) {
                invoiceNumber =
                    this.generateInvoiceNumber();
            }
            const items = await this.prepareInvoiceItems(tx, userId, data.items);
            let nextRecurringDate;
            if (data.isRecurring === true) {
                nextRecurringDate =
                    data.nextRecurringDate
                        ? new Date(data.nextRecurringDate)
                        : this.calculateNextRecurringDate(new Date(data.dueDate), data.recurringInterval);
            }
            const invoice = await tx.invoice.create({
                data: {
                    invoiceNumber,
                    userId,
                    clientId: data.clientId,
                    dueDate: new Date(data.dueDate),
                    paymentTerms: data.paymentTerms,
                    status: InvoiceStatus.PENDING,
                    isSent: false,
                    isRecurring: data.isRecurring ?? false,
                    recurringInterval: data.isRecurring
                        ? data.recurringInterval
                        : null,
                    nextRecurringDate: nextRecurringDate ?? null,
                    items: {
                        create: items,
                    },
                },
                include: {
                    client: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return invoice;
        });
    };
    getInvoices = async (userId) => {
        return this.prisma.invoice.findMany({
            where: {
                userId,
            },
            include: {
                client: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    };
    getInvoiceById = async (userId, invoiceId) => {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId,
            },
            include: {
                client: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!invoice) {
            throw new ApiError("Invoice not found", 404);
        }
        return invoice;
    };
    updateInvoice = async (userId, invoiceId, data) => {
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findFirst({
                where: {
                    id: invoiceId,
                    userId,
                },
            });
            if (!invoice) {
                throw new ApiError("Invoice not found", 404);
            }
            if (invoice.status ===
                InvoiceStatus.PAID) {
                throw new ApiError("Paid invoice cannot be modified", 400);
            }
            if (data.clientId) {
                const client = await tx.client.findFirst({
                    where: {
                        id: data.clientId,
                        userId,
                    },
                });
                if (!client) {
                    throw new ApiError("Client not found", 404);
                }
            }
            if (data.isRecurring === true &&
                !data.recurringInterval &&
                !invoice.recurringInterval) {
                throw new ApiError("Recurring interval is required", 400);
            }
            if (data.items !== undefined) {
                const items = await this.prepareInvoiceItems(tx, userId, data.items);
                await tx.invoiceItem.deleteMany({
                    where: {
                        invoiceId,
                    },
                });
                await tx.invoiceItem.createMany({
                    data: items.map((item) => ({
                        invoiceId,
                        productId: item.productId,
                        name: item.name,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                });
            }
            let nextRecurringDate;
            if (data.isRecurring === false) {
                nextRecurringDate = null;
            }
            else if (data.nextRecurringDate) {
                nextRecurringDate =
                    new Date(data.nextRecurringDate);
            }
            const updatedInvoice = await tx.invoice.update({
                where: {
                    id: invoiceId,
                },
                data: {
                    ...(data.clientId !==
                        undefined && {
                        clientId: data.clientId,
                    }),
                    ...(data.dueDate !==
                        undefined && {
                        dueDate: new Date(data.dueDate),
                    }),
                    ...(data.paymentTerms !==
                        undefined && {
                        paymentTerms: data.paymentTerms,
                    }),
                    ...(data.isRecurring !==
                        undefined && {
                        isRecurring: data.isRecurring,
                    }),
                    ...(data.recurringInterval !==
                        undefined && {
                        recurringInterval: data.recurringInterval,
                    }),
                    ...(nextRecurringDate !==
                        undefined && {
                        nextRecurringDate,
                    }),
                },
                include: {
                    client: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return updatedInvoice;
        });
    };
    updateStatus = async (userId, invoiceId, status) => {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId,
            },
        });
        if (!invoice) {
            throw new ApiError("Invoice not found", 404);
        }
        if (invoice.status ===
            InvoiceStatus.PAID &&
            status !== InvoiceStatus.PAID) {
            throw new ApiError("Paid invoice status cannot be changed", 400);
        }
        return this.prisma.invoice.update({
            where: {
                id: invoiceId,
            },
            data: {
                status,
            },
            include: {
                client: true,
                items: true,
            },
        });
    };
    deleteInvoice = async (userId, invoiceId) => {
        const invoice = await this.prisma.invoice.findFirst({
            where: {
                id: invoiceId,
                userId,
            },
        });
        if (!invoice) {
            throw new ApiError("Invoice not found", 404);
        }
        if (invoice.status ===
            InvoiceStatus.PAID) {
            throw new ApiError("Paid invoice cannot be deleted", 400);
        }
        await this.prisma.invoice.delete({
            where: {
                id: invoiceId,
            },
        });
        return {
            message: "Invoice deleted successfully"
        };
    };
    markOverdueInvoices = async () => {
        const now = new Date();
        const result = await this.prisma.invoice.updateMany({
            where: {
                status: InvoiceStatus.PENDING,
                dueDate: {
                    lt: now,
                },
            },
            data: {
                status: InvoiceStatus.OVERDUE,
            },
        });
        return result;
    };
    calculateNextRecurringDate = (date, interval) => {
        const next = new Date(date);
        switch (interval) {
            case RecurringInterval.WEEKLY:
                next.setDate(next.getDate() + 7);
                break;
            case RecurringInterval.MONTHLY:
                next.setMonth(next.getMonth() + 1);
                break;
            case RecurringInterval.YEARLY:
                next.setFullYear(next.getFullYear() + 1);
                break;
        }
        return next;
    };
}
