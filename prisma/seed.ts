import { mockUser, mockCategories, mockProducts, mockClients, mockInvoices, mockRecurring } from './data.js' 
import { prisma } from '../src/config/prisma.js'
import { hashPassword } from '../src/lib/argon.js'

async function main() {
  console.log('Memulai proses seeding database...')

  const hashedPassword = await hashPassword('password12345')

  const user = await prisma.user.upsert({
    where: { email: mockUser.email },
    update: {},
    create: {
      email: mockUser.email,
      name: mockUser.name,
      password: hashedPassword, 
      isEmailVerified: mockUser.emailVerified,
    },
  })
  console.log(`User ${user.email} dibuat.`)

  for (const cat of mockCategories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        userId: user.id,
        name: cat.name,
        description: cat.description,
        status: cat.status.toUpperCase() as any, 
      },
    })
  }
  console.log(`${mockCategories.length} Categories dibuat.`)

  for (const prod of mockProducts) {
    await prisma.product.create({
      data: {
        id: prod.id,
        userId: user.id,
        categoryId: prod.categoryId,
        name: prod.name,
        type: prod.type.toUpperCase() as any, 
        description: prod.description,
        price: prod.price,
        unit: prod.unit,
        tax: prod.tax,
        status: prod.status.toUpperCase() as any, 
      },
    })
  }
  console.log(`${mockProducts.length} Products dibuat.`)

  for (const client of mockClients) {
    await prisma.client.create({
      data: {
        id: client.id,
        userId: user.id,
        name: client.name,
        company: client.company || null,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        postalCode: client.postalCode,
        country: client.country,
        paymentTerms: client.paymentTerms,
        notes: client.notes,
        createdAt: new Date(client.createdAt),
      },
    })
  }
  console.log(`${mockClients.length} Clients dibuat.`)

  for (const inv of mockInvoices) {
    await prisma.invoice.create({
      data: {
        id: inv.id,
        userId: user.id,
        clientId: inv.clientId,
        number: inv.number,
        issueDate: new Date(inv.issueDate),
        dueDate: new Date(inv.dueDate),
        currency: inv.currency,
        paymentTerms: inv.paymentTerms,
        notes: inv.notes,
        terms: inv.terms,
        status: inv.status.toUpperCase() as any, 
        
        paymentDate: inv.payment ? new Date(inv.payment.date) : null,
        paymentMethod: inv.payment ? inv.payment.method : null,
        paymentReference: inv.payment ? inv.payment.reference : null,
        amountPaid: inv.payment ? inv.payment.amount : null,

        items: {
          create: inv.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            tax: item.tax,
          })),
        },

        activity: {
          create: inv.activity?.map((act) => ({
            id: act.id,
            label: act.label,
            description: act.description,
            date: new Date(act.date),
          })) || [],
        },
      },
    })
  }
  console.log(`${mockInvoices.length} Invoices dibuat.`)

  let recIndex = 1
  for (const rec of mockRecurring) {
    let recStatus = rec.status.toUpperCase()
    if (recStatus === 'COMPLETED') recStatus = 'CANCELLED'

    await prisma.invoice.create({
      data: {
        id: rec.id,
        userId: user.id,
        clientId: rec.clientId,
        number: `REC-2026-${String(recIndex).padStart(4, '0')}`, 
        issueDate: new Date(rec.startDate),
        dueDate: new Date(rec.startDate), 
        status: 'DRAFT', 
        paymentTerms: rec.paymentTerms,
        
        isRecurring: true,
        recurringInterval: rec.frequency.toUpperCase() as any, 
        nextRecurringDate: new Date(rec.nextInvoiceDate),
        endDate: rec.endDate ? new Date(rec.endDate) : null,
        recurringStatus: recStatus as any,

        items: {
          create: rec.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            tax: item.tax,
          })),
        },
      },
    })
    recIndex++
  }
  console.log(`${mockRecurring.length} Recurring Invoices dibuat.`)

  console.log('Seeding Selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })