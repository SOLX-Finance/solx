/*
  Warnings:

  - Added the required column `listing` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "indexer"."sale" ADD COLUMN     "listing" TEXT NOT NULL;
