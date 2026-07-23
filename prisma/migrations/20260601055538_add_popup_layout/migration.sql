-- CreateEnum
CREATE TYPE "PopupLayout" AS ENUM ('IMAGE_LEFT', 'IMAGE_RIGHT', 'IMAGE_TOP', 'TEXT_ONLY');

-- AlterTable
ALTER TABLE "PopupAnnouncement" ADD COLUMN     "layout" "PopupLayout" NOT NULL DEFAULT 'IMAGE_LEFT';
