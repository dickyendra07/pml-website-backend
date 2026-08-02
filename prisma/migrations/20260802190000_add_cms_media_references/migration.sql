ALTER TABLE "PopupAnnouncement"
ADD COLUMN "imageReference" JSONB;

ALTER TABLE "CatalogueItem"
ADD COLUMN "coverReference" JSONB;

ALTER TABLE "InsightPost"
ADD COLUMN "coverReference" JSONB;

ALTER TABLE "HomepageFeature"
ADD COLUMN "imageReference" JSONB;

ALTER TABLE "PageSeo"
ADD COLUMN "ogImageReference" JSONB;
