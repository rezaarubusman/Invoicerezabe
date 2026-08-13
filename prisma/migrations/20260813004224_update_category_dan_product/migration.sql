-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRODUCT', 'SERVICE');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tax" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'SERVICE',
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'pcs';
