-- CreateEnum
CREATE TYPE "LegalPageType" AS ENUM ('PRIVACY_POLICY', 'COOKIE_POLICY');

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL,
    "type" "LegalPageType" NOT NULL,
    "titleEn" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "seoTitleEn" TEXT,
    "metaDescriptionEn" TEXT,
    "titleId" TEXT,
    "contentId" TEXT,
    "seoTitleId" TEXT,
    "metaDescriptionId" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_type_key" ON "LegalPage"("type");

-- CreateIndex
CREATE INDEX "LegalPage_status_idx" ON "LegalPage"("status");
