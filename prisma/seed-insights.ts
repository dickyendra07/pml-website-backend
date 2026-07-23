import { PrismaClient, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

const insights = [
  {
    titleEn: 'Preparing a Successful BA/BE Study Submission',
    slugEn: 'preparing-successful-babe-study-submission',
    excerptEn:
      'Key considerations for sponsors before starting bioavailability and bioequivalence study discussions with PML.',
    contentEn:
      'A successful BA/BE study starts with complete product information, clear regulatory objectives, suitable study design, and aligned timelines between sponsor and CRO.',
    seoTitleEn: 'Preparing a Successful BA/BE Study Submission',
    metaDescriptionEn:
      'Key considerations for sponsors before starting bioavailability and bioequivalence study discussions with PML.',
    tagsEn: ['BA/BE', 'CRO', 'Regulatory'],

    titleId: null,
    slugId: null,
    excerptId: null,
    contentId: null,
    seoTitleId: null,
    metaDescriptionId: null,
    tagsId: [],

    category: 'articles',
    coverImage: '/images/pml/services/babe-studies-hero.png',
    status: PublishStatus.PUBLISHED,
    isFeatured: true,
    publishedAt: new Date(),
  },
  {
    titleEn: 'PML Clinical Trial Support for Pharmaceutical Development',
    slugEn: 'pml-clinical-trial-support',
    excerptEn:
      'Overview of clinical trial support, operational coordination, and study readiness for pharmaceutical sponsors.',
    contentEn:
      'PML supports clinical trial preparation through study planning, operational coordination, documentation support, and collaboration with relevant clinical partners.',
    seoTitleEn: 'PML Clinical Trial Support for Pharmaceutical Development',
    metaDescriptionEn:
      'Overview of clinical trial support, operational coordination, and study readiness for pharmaceutical sponsors.',
    tagsEn: ['Clinical Trial', 'Pharmaceutical Development'],

    titleId: null,
    slugId: null,
    excerptId: null,
    contentId: null,
    seoTitleId: null,
    metaDescriptionId: null,
    tagsId: [],

    category: 'articles',
    coverImage: '/images/pml/services/clinical-trial-hero.png',
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    publishedAt: new Date(),
  },
  {
    titleEn: 'Analytical Testing Capability for Product Quality Support',
    slugEn: 'analytical-testing-capability-product-quality',
    excerptEn:
      'How contract analysis services support pharmaceutical, cosmetic, food, beverage, and medical device quality requirements.',
    contentEn:
      'Analytical testing helps sponsors evaluate product quality, documentation readiness, and compliance needs across different product categories.',
    seoTitleEn: 'Analytical Testing Capability for Product Quality Support',
    metaDescriptionEn:
      'How contract analysis services support pharmaceutical, cosmetic, food, beverage, and medical device quality requirements.',
    tagsEn: ['Contract Analysis', 'Laboratory'],

    titleId: null,
    slugId: null,
    excerptId: null,
    contentId: null,
    seoTitleId: null,
    metaDescriptionId: null,
    tagsId: [],

    category: 'publications',
    coverImage: '/images/pml/facilities-gallery/analytical-main.jpg',
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    publishedAt: new Date(),
  },
  {
    titleEn: 'PML Facility and Service Updates',
    slugEn: 'pml-facility-and-service-updates',
    excerptEn:
      'Latest updates related to Pharma Metric Labs facilities, service capabilities, and collaboration readiness.',
    contentEn:
      'PML continues to support pharmaceutical development through integrated clinical, analytical, and regulatory capabilities.',
    seoTitleEn: 'PML Facility and Service Updates',
    metaDescriptionEn:
      'Latest updates related to Pharma Metric Labs facilities, service capabilities, and collaboration readiness.',
    tagsEn: ['News', 'Facility'],

    titleId: null,
    slugId: null,
    excerptId: null,
    contentId: null,
    seoTitleId: null,
    metaDescriptionId: null,
    tagsId: [],

    category: 'news',
    coverImage: '/images/pml/cta-lab-background.png',
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    publishedAt: new Date(),
  },
  {
    titleEn: 'What information should sponsors prepare before contacting PML?',
    slugEn: 'what-information-should-sponsors-prepare',
    excerptEn:
      'Sponsors should prepare product details, service needs, project objectives, expected timeline, and available documents.',
    contentEn:
      'Before contacting PML, sponsors can prepare product information, target service scope, regulatory objective, available documents, and expected project timeline.',
    seoTitleEn:
      'What Information Should Sponsors Prepare Before Contacting PML?',
    metaDescriptionEn:
      'Sponsors should prepare product details, service needs, project objectives, expected timeline, and available documents.',
    tagsEn: ['FAQ'],

    titleId: null,
    slugId: null,
    excerptId: null,
    contentId: null,
    seoTitleId: null,
    metaDescriptionId: null,
    tagsId: [],

    category: 'faq',
    coverImage: '/images/pml/facilities-gallery/clinical-main.jpg',
    status: PublishStatus.PUBLISHED,
    isFeatured: false,
    publishedAt: new Date(),
  },
];

async function main() {
  for (const insight of insights) {
    const item = await prisma.insightPost.upsert({
      where: {
        slugEn: insight.slugEn,
      },
      update: insight,
      create: insight,
    });

    console.log(`✅ Insight seeded: ${item.titleEn}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
