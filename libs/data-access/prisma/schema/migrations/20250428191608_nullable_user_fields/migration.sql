/*
  Warnings:

  - Made the column `wallet_address` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "wallet_address" SET NOT NULL;
