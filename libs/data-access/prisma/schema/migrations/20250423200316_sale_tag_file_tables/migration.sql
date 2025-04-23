/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet_address]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PROFILE_PICTURE', 'SALE_CONTENT', 'SALE_DEMO', 'SALE_PREVIEW');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "avatar_url",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password",
ADD COLUMN     "profile_picture_id" TEXT,
ADD COLUMN     "wallet_address" TEXT;

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "remote_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "ai_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "ai_review_details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_remote_id_key" ON "file"("remote_id");

-- CreateIndex
CREATE UNIQUE INDEX "sale_tag_name_key" ON "sale_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_address_key" ON "user"("wallet_address");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_profile_picture_id_fkey" FOREIGN KEY ("profile_picture_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
