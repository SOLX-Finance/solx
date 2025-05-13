-- DropForeignKey
ALTER TABLE "api"."file" DROP CONSTRAINT "file_saleId_fkey";

-- AlterTable
ALTER TABLE "api"."file" ALTER COLUMN "saleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "api"."file" ADD CONSTRAINT "file_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "api"."sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
