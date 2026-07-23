-- CreateEnum
CREATE TYPE "CatalogueDownloadMode" AS ENUM ('PUBLIC_DOWNLOAD', 'REQUEST_REQUIRED');

-- AlterTable
ALTER TABLE "CatalogueItem" ADD COLUMN     "downloadMode" "CatalogueDownloadMode" NOT NULL DEFAULT 'REQUEST_REQUIRED';
