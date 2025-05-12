-- CreateEnum
CREATE TYPE "AiScanResult" AS ENUM ('NOT_SCANNED', 'SCANNING', 'CLEAN', 'SUSPICIOUS', 'MALICIOUS');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');

-- AlterEnum
ALTER TYPE "FileType" ADD VALUE 'KYC_DOCUMENT';

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "ai_scan_result" "AiScanResult" NOT NULL DEFAULT 'NOT_SCANNED';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "kyc_details" JSONB,
ADD COLUMN     "kyc_status" "KycStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN     "kyc_verified_at" TIMESTAMP(3),
ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"Role"[];
