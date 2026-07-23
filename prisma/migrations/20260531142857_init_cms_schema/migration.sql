-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED', 'SPAM');

-- CreateEnum
CREATE TYPE "PopupType" AS ENUM ('ANNOUNCEMENT', 'PROMOTION', 'ALERT', 'INFORMATION');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER');

-- AlterTable
ALTER TABLE "ProposalSubmission" ADD COLUMN     "internalNote" TEXT,
ADD COLUMN     "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "service" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "sourcePage" TEXT,
    "internalNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopupAnnouncement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "buttonLabel" TEXT,
    "buttonUrl" TEXT,
    "imageUrl" TEXT,
    "type" "PopupType" NOT NULL DEFAULT 'ANNOUNCEMENT',
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopupAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogueItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "serviceType" TEXT,
    "fileUrl" TEXT,
    "coverImage" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogueRequest" (
    "id" TEXT NOT NULL,
    "catalogueId" TEXT,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogueRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT,
    "category" TEXT NOT NULL,
    "coverImage" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsightPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageFeature" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "referenceId" TEXT,
    "imageUrl" TEXT,
    "buttonLabel" TEXT,
    "buttonUrl" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'OTHER',
    "altText" TEXT,
    "caption" TEXT,
    "folder" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");

-- CreateIndex
CREATE INDEX "AdminUser_isActive_idx" ON "AdminUser"("isActive");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_idx" ON "ContactInquiry"("status");

-- CreateIndex
CREATE INDEX "ContactInquiry_service_idx" ON "ContactInquiry"("service");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "SiteSetting_group_idx" ON "SiteSetting"("group");

-- CreateIndex
CREATE INDEX "SiteSetting_isPublic_idx" ON "SiteSetting"("isPublic");

-- CreateIndex
CREATE INDEX "PopupAnnouncement_status_idx" ON "PopupAnnouncement"("status");

-- CreateIndex
CREATE INDEX "PopupAnnouncement_startsAt_idx" ON "PopupAnnouncement"("startsAt");

-- CreateIndex
CREATE INDEX "PopupAnnouncement_endsAt_idx" ON "PopupAnnouncement"("endsAt");

-- CreateIndex
CREATE INDEX "PopupAnnouncement_priority_idx" ON "PopupAnnouncement"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogueItem_slug_key" ON "CatalogueItem"("slug");

-- CreateIndex
CREATE INDEX "CatalogueItem_status_idx" ON "CatalogueItem"("status");

-- CreateIndex
CREATE INDEX "CatalogueItem_serviceType_idx" ON "CatalogueItem"("serviceType");

-- CreateIndex
CREATE INDEX "CatalogueItem_sortOrder_idx" ON "CatalogueItem"("sortOrder");

-- CreateIndex
CREATE INDEX "CatalogueRequest_catalogueId_idx" ON "CatalogueRequest"("catalogueId");

-- CreateIndex
CREATE INDEX "CatalogueRequest_status_idx" ON "CatalogueRequest"("status");

-- CreateIndex
CREATE INDEX "CatalogueRequest_createdAt_idx" ON "CatalogueRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InsightPost_slug_key" ON "InsightPost"("slug");

-- CreateIndex
CREATE INDEX "InsightPost_category_idx" ON "InsightPost"("category");

-- CreateIndex
CREATE INDEX "InsightPost_status_idx" ON "InsightPost"("status");

-- CreateIndex
CREATE INDEX "InsightPost_isFeatured_idx" ON "InsightPost"("isFeatured");

-- CreateIndex
CREATE INDEX "InsightPost_publishedAt_idx" ON "InsightPost"("publishedAt");

-- CreateIndex
CREATE INDEX "HomepageFeature_type_idx" ON "HomepageFeature"("type");

-- CreateIndex
CREATE INDEX "HomepageFeature_status_idx" ON "HomepageFeature"("status");

-- CreateIndex
CREATE INDEX "HomepageFeature_sortOrder_idx" ON "HomepageFeature"("sortOrder");

-- CreateIndex
CREATE INDEX "MediaAsset_type_idx" ON "MediaAsset"("type");

-- CreateIndex
CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- CreateIndex
CREATE INDEX "ProposalSubmission_status_idx" ON "ProposalSubmission"("status");

-- CreateIndex
CREATE INDEX "ProposalSubmission_serviceType_idx" ON "ProposalSubmission"("serviceType");

-- CreateIndex
CREATE INDEX "ProposalSubmission_createdAt_idx" ON "ProposalSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "CatalogueRequest" ADD CONSTRAINT "CatalogueRequest_catalogueId_fkey" FOREIGN KEY ("catalogueId") REFERENCES "CatalogueItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
