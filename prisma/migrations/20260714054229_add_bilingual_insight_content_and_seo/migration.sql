-- Preserve existing English insight content by renaming legacy columns.
DROP INDEX IF EXISTS "InsightPost_slug_key";

ALTER TABLE "InsightPost"
RENAME COLUMN "title" TO "titleEn";

ALTER TABLE "InsightPost"
RENAME COLUMN "slug" TO "slugEn";

ALTER TABLE "InsightPost"
RENAME COLUMN "excerpt" TO "excerptEn";

ALTER TABLE "InsightPost"
RENAME COLUMN "content" TO "contentEn";

ALTER TABLE "InsightPost"
RENAME COLUMN "tags" TO "tagsEn";

-- English content becomes optional so Indonesia-only content is supported.
ALTER TABLE "InsightPost"
ALTER COLUMN "titleEn" DROP NOT NULL,
ALTER COLUMN "slugEn" DROP NOT NULL;

-- Add localized Indonesian content and language-specific SEO fields.
ALTER TABLE "InsightPost"
ADD COLUMN "seoTitleEn" TEXT,
ADD COLUMN "metaDescriptionEn" TEXT,
ADD COLUMN "titleId" TEXT,
ADD COLUMN "slugId" TEXT,
ADD COLUMN "excerptId" TEXT,
ADD COLUMN "contentId" TEXT,
ADD COLUMN "tagsId" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "seoTitleId" TEXT,
ADD COLUMN "metaDescriptionId" TEXT;

CREATE UNIQUE INDEX "InsightPost_slugEn_key"
ON "InsightPost"("slugEn");

CREATE UNIQUE INDEX "InsightPost_slugId_key"
ON "InsightPost"("slugId");
