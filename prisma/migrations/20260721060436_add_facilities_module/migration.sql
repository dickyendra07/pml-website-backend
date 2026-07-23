-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleId" TEXT,
    "eyebrowEn" TEXT,
    "eyebrowId" TEXT,
    "summaryEn" TEXT,
    "summaryId" TEXT,
    "contentEn" TEXT,
    "contentId" TEXT,
    "image" TEXT,
    "gallery" JSONB,
    "pointsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pointsId" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_key_key" ON "Facility"("key");

-- CreateIndex
CREATE INDEX "Facility_category_idx" ON "Facility"("category");

-- CreateIndex
CREATE INDEX "Facility_status_idx" ON "Facility"("status");

-- CreateIndex
CREATE INDEX "Facility_sortOrder_idx" ON "Facility"("sortOrder");
