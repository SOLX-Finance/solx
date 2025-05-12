-- CreateEnum
CREATE TYPE "api"."AiScanResult" AS ENUM ('NOT_SCANNED', 'SCANNING', 'CLEAN', 'SUSPICIOUS', 'MALICIOUS');

-- CreateEnum
CREATE TYPE "api"."KycStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');

-- AlterEnum
ALTER TYPE "api"."FileType" ADD VALUE 'KYC_DOCUMENT';

-- AlterTable
ALTER TABLE "api"."file" ADD COLUMN     "ai_scan_result" "api"."AiScanResult" NOT NULL DEFAULT 'NOT_SCANNED';

-- AlterTable
ALTER TABLE "api"."user" ADD COLUMN     "kyc_details" JSONB,
ADD COLUMN     "kyc_status" "api"."KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN     "kyc_verified_at" TIMESTAMP(3),
ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"api"."Role"[];
