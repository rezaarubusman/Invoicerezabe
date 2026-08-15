import { PrismaClient } from "@prisma/client";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

export class UserService {
  private prisma: PrismaClient;
  private cloudinaryService: CloudinaryService;

  constructor(prismaClient: PrismaClient, cloudinaryService: CloudinaryService) {
    this.prisma = prismaClient;
    this.cloudinaryService = cloudinaryService;
  }

  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        businessProfile: true,
        invoiceSetting: true,
      },
    });
    return user;
  }

  async updateProfile(userId: string, data: { name: string; email: string }) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
    });
  }

  async updateBusinessProfile(userId: string, data: any, file?: Express.Multer.File) {
    let logoUrl = undefined;

    if (file) {
      const existingBusiness = await this.prisma.businessProfile.findUnique({ 
        where: { userId } 
      });
      
      if (existingBusiness?.logoUrl) {
        await this.cloudinaryService.deleteByUrl(existingBusiness.logoUrl, "image");
      }

      const uploadResult = await this.cloudinaryService.uploadImage(file, "fakturia/business-logos");
      logoUrl = uploadResult.url;
    }

    return await this.prisma.businessProfile.upsert({
      where: { userId },
      update: { ...data, ...(logoUrl && { logoUrl }) },
      create: { userId, ...data, logoUrl },
    });
  }

  async updateInvoiceSettings(userId: string, data: any) {
    return await this.prisma.invoiceSetting.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}