/*
  Warnings:

  - Added the required column `userId` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "api"."sale" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "api"."sale" ADD CONSTRAINT "sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "api"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
