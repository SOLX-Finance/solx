-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "api";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "indexer";

-- CreateEnum
CREATE TYPE "api"."FileType" AS ENUM ('PROFILE_PICTURE', 'KYC_DOCUMENT', 'SALE_CONTENT', 'SALE_DEMO', 'SALE_PREVIEW');

-- CreateEnum
CREATE TYPE "api"."AiScanResult" AS ENUM ('NOT_SCANNED', 'SCANNING', 'CLEAN', 'SUSPICIOUS', 'MALICIOUS');

-- CreateEnum
CREATE TYPE "api"."Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "api"."KycStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "api"."file" (
    "id" TEXT NOT NULL,
    "type" "api"."FileType" NOT NULL,
    "remote_id" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "content_hash" TEXT,
    "ai_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "ai_scan_result" "api"."AiScanResult" NOT NULL DEFAULT 'NOT_SCANNED',
    "ai_review_details" JSONB,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "saleId" TEXT NOT NULL,
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
CREATE TABLE "api"."sale" (
    "id" TEXT NOT NULL,
    "listingId" TEXT,
    "listing" TEXT,
    "nftMint" TEXT,
    "buyer" TEXT,
    "collateralMint" TEXT,
    "collateralAmount" TEXT,
    "priceUsd" TEXT,
    "description" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api"."user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "roles" "api"."Role"[] DEFAULT ARRAY['USER']::"api"."Role"[],
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "kyc_status" "api"."KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "kyc_details" JSONB,
    "kyc_verified_at" TIMESTAMP(3),
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
ALTER TABLE "api"."file" ADD CONSTRAINT "file_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "api"."sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api"."file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "api"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
