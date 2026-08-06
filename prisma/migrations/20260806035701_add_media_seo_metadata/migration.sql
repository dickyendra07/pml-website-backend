-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "description" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "title" TEXT;
