-- CreateTable
CREATE TABLE "CareerPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT,
    "location" TEXT,
    "employmentType" TEXT,
    "experienceLevel" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "benefits" TEXT,
    "applyEmail" TEXT,
    "applyUrl" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerPost_slug_key" ON "CareerPost"("slug");

-- CreateIndex
CREATE INDEX "CareerPost_status_idx" ON "CareerPost"("status");

-- CreateIndex
CREATE INDEX "CareerPost_department_idx" ON "CareerPost"("department");

-- CreateIndex
CREATE INDEX "CareerPost_sortOrder_idx" ON "CareerPost"("sortOrder");

-- CreateIndex
CREATE INDEX "CareerPost_publishedAt_idx" ON "CareerPost"("publishedAt");
