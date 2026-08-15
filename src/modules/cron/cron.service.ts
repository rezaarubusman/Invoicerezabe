import cron from "node-cron";
import { PrismaClient, RecurringStatus, InvoiceStatus } from "@prisma/client";
import { InvoiceService } from "../invoice/invoice.service.js";

export class CronService {
  constructor(
    private prisma: PrismaClient,
    private invoiceService: InvoiceService
  ) {
    this.startCron();
  }

  private startCron = () => {
    // Berjalan setiap hari pada jam 00:01
    cron.schedule("1 0 * * *", async () => {
      console.log("Running recurring invoice check...");
      await this.generateRecurringInvoices();
    });
  };

  private generateRecurringInvoices = async () => {
    const today = new Date();
    
    const dueRecurring = await this.prisma.invoice.findMany({
      where: {
        isRecurring: true,
        recurringStatus: RecurringStatus.ACTIVE,
        nextRecurringDate: { lte: today },
        OR: [{ endDate: null }, { endDate: { gte: today } }]
      },
      include: { items: true }
    });

    for (const schedule of dueRecurring) {
      const nextDate = (this.invoiceService as any).calculateNextRecurringDate(
        schedule.nextRecurringDate!, 
        schedule.recurringInterval!
      );

      await this.prisma.$transaction(async (tx) => {
        const newInvoice = await tx.invoice.create({
          data: {
            number: this.invoiceService.generateInvoiceNumber(),
            userId: schedule.userId,
            clientId: schedule.clientId,
            issueDate: today,
            dueDate: today, 
            currency: schedule.currency,
            paymentTerms: schedule.paymentTerms,
            terms: schedule.terms,
            notes: schedule.notes,
            status: InvoiceStatus.PENDING, 
            isSent: false,
            isRecurring: false, 
            items: {
              create: schedule.items.map(item => ({
                productId: item.productId,
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                tax: item.tax
              }))
            },
            activity: {
              create: [
                {
                  label: "Invoice Generated",
                  description: "Automatically generated from recurring schedule."
                }
              ]
            }
          }
        });

        await tx.invoice.update({
          where: { id: schedule.id },
          data: { nextRecurringDate: nextDate }
        });

        console.log(`Successfully generated recurring invoice: ${newInvoice.number}`);
      });
    }
  };
}