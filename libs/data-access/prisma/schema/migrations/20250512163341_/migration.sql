-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "api";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "indexer";

-- CreateEnum
CREATE TYPE "api"."FileType" AS ENUM ('PROFILE_PICTURE', 'SALE_CONTENT', 'SALE_DEMO', 'SALE_PREVIEW');

-- CreateEnum
CREATE TYPE "api"."Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "api"."file" (
    "id" TEXT NOT NULL,
    "type" "api"."FileType" NOT NULL,
    "remote_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "ai_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "ai_review_details" JSONB,
    "content_hash" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."indexed_contract_action" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indexed_contract_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexer"."network" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lastIndexedId" TEXT,

    CONSTRAINT "network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."sale_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexer"."sale" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "nftMint" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "collateralMint" TEXT NOT NULL,
    "collateralAmount" TEXT NOT NULL,
    "priceUsd" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "roles" "api"."Role"[] DEFAULT ARRAY[]::"api"."Role"[],
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT,
    "profile_picture_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_remote_id_key" ON "api"."file"("remote_id");

-- CreateIndex
CREATE UNIQUE INDEX "sale_tag_name_key" ON "api"."sale_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "api"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallet_address_key" ON "api"."user"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "api"."user"("username");

-- AddForeignKey
ALTER TABLE "api"."file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "api"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexer"."sale" ADD CONSTRAINT "sale_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "api"."file"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
