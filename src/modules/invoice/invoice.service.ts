import type { PrismaClient, Prisma } from "@prisma/client";
import { InvoiceStatus, RecurringInterval, RecurringStatus } from "@prisma/client";
import { ApiError } from "../../utils/api-error.js";
import type { CreateInvoiceDto, CreateInvoiceItemDto, UpdateInvoiceDto } from "./invoice.dto.js";

export class InvoiceService {
  constructor(private prisma: PrismaClient) {}

  private generateInvoiceNumber = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const random = Math.floor(
      100000 + Math.random() * 900000
    );

    return `INV-${year}${month}${day}-${random}`;
  };

  private calculateItemTotal = (
    price: number,
    quantity: number
  ) => {
    return price * quantity;
  };

  private prepareInvoiceItems = async ( tx: Prisma.TransactionClient, userId: string, items: CreateInvoiceItemDto[] ) => {
    if (!items || items.length === 0) {
      throw new ApiError(
        "Invoice must contain at least one item",
        400
      );
    }

    return Promise.all(
      items.map(async (item) => {
        if (item.productId) {
          const product =
            await tx.product.findFirst({
              where: {
                id: item.productId,
                userId,
                deletedAt: null,
              },
            });

          if (!product) {
            throw new ApiError( `Product ${item.productId} not found`, 404 );
          }

          return {
            productId: product.id,
            name: product.name,
            description: item.description ?? product.description,
            quantity: item.quantity,
            unitPrice: Number(product.price),
            discount: item.discount ?? 0,
            tax: item.tax ?? 0,
          };
        }

        if ( !item.name || item.unitPrice === undefined ) {
          throw new ApiError( "Custom invoice item requires name and price", 400 );
        }

        return {
          productId: null,
          name: item.name,
          description: item.description ?? null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount ?? 0,
          tax: item.tax ?? 0,
        };
      })
    );
  };

  createInvoice = async ( userId: string, data: CreateInvoiceDto ) => {
    return this.prisma.$transaction(
      async (tx) => {
        const client =
          await tx.client.findFirst({
            where: {
              id: data.clientId,
              userId,
            },
          });

        if (!client) {
          throw new ApiError( "Client not found", 404 );
        }

        if ( data.isRecurring === true && !data.recurringInterval ) {
          throw new ApiError( "Recurring interval is required for recurring invoice", 400 );
        }

        let invoiceNumber = data.number || this.generateInvoiceNumber();

        while (
          await tx.invoice.findUnique({
            where: { number: invoiceNumber },
          })
        ) {
          invoiceNumber = this.generateInvoiceNumber();
        }

        const items =
          await this.prepareInvoiceItems(
            tx,
            userId,
            data.items
          );

        let nextRecurringDate: Date | undefined;

        if (data.isRecurring === true) {
          nextRecurringDate =
            data.nextRecurringDate
              ? new Date(
                  data.nextRecurringDate)
              : this.calculateNextRecurringDate( new Date(data.dueDate), data.recurringInterval! );
        }

        const invoice =
          await tx.invoice.create({
            data: {
              number: invoiceNumber,
              userId,
              clientId: data.clientId,
              dueDate: new Date(data.dueDate),
              currency: data.currency,
              paymentTerms: data.paymentTerms,
              terms: data.terms,
              notes: data.notes,
              status: data.status ?? InvoiceStatus.PENDING,
              isSent: false,
              isRecurring: data.isRecurring ?? false,
              recurringInterval: data.isRecurring ? data.recurringInterval : null,
              nextRecurringDate: nextRecurringDate ?? null,
              endDate: data.endDate? new Date(data.endDate) : null,
              recurringStatus: data.isRecurring ? (data.recurringStatus ?? RecurringStatus.ACTIVE) : null,
              items: {
                create: items,
              },
            
            activity: {
              create: [
                {
                  label: data.status === InvoiceStatus.DRAFT ? "Invoice drafted" : "Invoice created", 
                  description: "Inoice was successfully generated.",
                },
              ],
            },
          },
            
          include: {
            client: true,
            items: { include: { product: true }, },
            activity: { orderBy: { date: 'desc' }}
          },
        });

        return invoice;
      }
    );
  };

  getInvoices = async (
    userId: string,
    params: {
      search?: string;
      status?: string;
      clientId?: string;
      sortBy?: string;
      sortDir?: string;
      page?: number;
      limit?: number;
      isRecurring?: boolean;
    }
  ) => {
    const {
      search,
      status,
      clientId,
      sortBy = "issueDate",
      sortDir = "desc",
      page = 1,
      limit = 8, 
      isRecurring,
    } = params;

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.InvoiceWhereInput = {
      userId,
      ...(isRecurring !== undefined && { isRecurring }),
      ...(status && status !== "all" && { status: status.toUpperCase() as InvoiceStatus }),
      ...(clientId && clientId !== "all" && { clientId }),
      ...(search && {
        OR: [
          { number: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
          { client: { company: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where: whereCondition,
        include: {
          client: true,
          items: { include: { product: true } },
        },
        orderBy: {
          [sortBy]: sortDir,
        },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where: whereCondition }),
    ]);

    return {
      invoices: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  getInvoiceById = async ( userId: string, invoiceId: string ) => {
    const invoice =
      await this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          userId,
        },

        include: {
          client: true,
          items: { include: { product: true }, },
          activity: { orderBy: {date: 'desc'}, },
        },
      });

    if (!invoice) {
      throw new ApiError( "Invoice not found", 404 );
    }

    return invoice;
  };

  updateInvoice = async ( userId: string, invoiceId: string, data: UpdateInvoiceDto ) => {
    return this.prisma.$transaction(
      async (tx) => {
        const invoice =
          await tx.invoice.findFirst({
            where: {
              id: invoiceId,
              userId,
            },
          });

        if (!invoice) {
          throw new ApiError( "Invoice not found", 404 );
        }

        if (
          invoice.status ===
          InvoiceStatus.PAID
        ) {
          throw new ApiError( "Paid invoice cannot be modified", 400 );
        }

        if (data.clientId) {
          const client =
            await tx.client.findFirst({
              where: {
                id: data.clientId,
                userId,
              },
            });

          if (!client) {
            throw new ApiError( "Client not found", 404 );
          }
        }

        if (
          data.isRecurring === true &&
          !data.recurringInterval &&
          !invoice.recurringInterval
        ) {
          throw new ApiError( "Recurring interval is required", 400 );
        }

        if (data.items !== undefined) {
          const items =
            await this.prepareInvoiceItems(
              tx,
              userId,
              data.items
            );

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
              unitPrice: item.unitPrice,
            })),
          });
        }

        let nextRecurringDate:
          | Date
          | null
          | undefined;

        if (
          data.isRecurring === false
        ) {
          nextRecurringDate = null;
        } else if (
          data.nextRecurringDate
        ) {
          nextRecurringDate =
            new Date(
              data.nextRecurringDate
            );
        }

        const updatedInvoice =
          await tx.invoice.update({
            where: {
              id: invoiceId,
            },

            data: {
              ...(data.clientId !== undefined && { clientId: data.clientId }),
              ...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate)}),
              ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
              ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
              ...(data.recurringInterval !== undefined && { recurringInterval: data.recurringInterval }),
              ...(nextRecurringDate !== undefined && { nextRecurringDate }),
              ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
              ...(data.recurringStatus !== undefined && { RecurringStatus: data.recurringStatus }),
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
      }
    );
  };

  updateStatus = async ( userId: string, invoiceId: string, status: InvoiceStatus, paymentData?: { paymentMethod?: string; paymentReference?: string; amountPaid?: number } ) => {
    const invoice =
      await this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          userId,
        },
      });

    if (!invoice) {
      throw new ApiError( "Invoice not found", 404 );
    }

    if (
      invoice.status ===
        InvoiceStatus.PAID &&
      status !== InvoiceStatus.PAID
    ) {
      throw new ApiError( 
        "Paid invoice status cannot be changed", 400 );
    }

    const isPaying = status === InvoiceStatus.PAID;

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        ...(isPaying && {
          paymentDate: new Date(),
          paymentMethod: paymentData?.paymentMethod || "bank_transfer",
          paymentReference: paymentData?.paymentReference,
          amountPaid: paymentData?.amountPaid,
        }),
        activity: {
          create: {
            label: `Status changed to ${status.toLowerCase()}`,
            description: isPaying 
              ? `Payment received via ${paymentData?.paymentMethod || "bank transfer"}`
              : "Status updated manually",
          },
        },
      },
      include: {
        client: true,
        items: true,
        activity: { orderBy: { date: 'desc' } }
      },
    });
  };

  deleteInvoice = async ( userId: string, invoiceId: string ) => {
    const invoice =
      await this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          userId,
        },
      });

    if (!invoice) {
      throw new ApiError( "Invoice not found", 404 );
    }

    if (
      invoice.status ===
      InvoiceStatus.PAID
    ) {
      throw new ApiError( "Paid invoice cannot be deleted", 400 );
    }

    await this.prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    return {
      message: "Invoice deleted successfully" };
  };

  markOverdueInvoices = async () => {
    const now = new Date();

    const result =
      await this.prisma.invoice.updateMany({
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

  private calculateNextRecurringDate = (
    date: Date,
    interval: RecurringInterval
  ) => {
    const next = new Date(date);

    switch (interval) {
      case RecurringInterval.WEEKLY:
        next.setDate(
          next.getDate() + 7
        );
        break;

      case RecurringInterval.MONTHLY:
        next.setMonth(
          next.getMonth() + 1
        );
        break;

      case RecurringInterval.YEARLY:
        next.setFullYear(
          next.getFullYear() + 1
        );
        break;
    }

    return next;
  };
}