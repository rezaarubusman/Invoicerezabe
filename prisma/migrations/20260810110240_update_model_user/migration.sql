-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeSessionId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
