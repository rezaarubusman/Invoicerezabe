-- CreateEnum
CREATE TYPE "RecurringStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "recurringStatus" "RecurringStatus";
