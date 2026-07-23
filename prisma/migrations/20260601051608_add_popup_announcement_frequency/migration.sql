-- CreateEnum
CREATE TYPE "PopupFrequency" AS ENUM ('ONCE_PER_SESSION', 'ONCE_PER_DAY', 'ALWAYS');

-- AlterTable
ALTER TABLE "PopupAnnouncement" ADD COLUMN     "frequency" "PopupFrequency" NOT NULL DEFAULT 'ONCE_PER_SESSION',
ADD COLUMN     "placementPages" TEXT[] DEFAULT ARRAY['/']::TEXT[];
