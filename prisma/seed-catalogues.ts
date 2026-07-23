import { PrismaClient, CatalogueDownloadMode, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

const catalogues = [
  {
    title: 'BA/BE Catalogue',
    slug: 'babe-catalogue',
    description:
      'Catalogue material for bioavailability and bioequivalence study capability, clinical facility, bioanalytical support, validated methods, and accepted study outputs.',
    serviceType: 'BA/BE Studies',
    coverImage: '/images/pml/services/babe-studies-hero.png',
    fileUrl: null,
    downloadMode: CatalogueDownloadMode.REQUEST_REQUIRED,
    status: PublishStatus.PUBLISHED,
    sortOrder: 1,
  },
  {
    title: 'Clinical Trial Catalogue',
    slug: 'clinical-trial-catalogue',
    description:
      'Catalogue material for clinical trial service capability, study flow, clinical operations, project support, portfolio areas, and collaboration readiness.',
    serviceType: 'Clinical Trial',
    coverImage: '/images/pml/services/clinical-trial-hero.png',
    fileUrl: null,
    downloadMode: CatalogueDownloadMode.REQUEST_REQUIRED,
    status: PublishStatus.PUBLISHED,
    sortOrder: 2,
  },
  {
    title: 'Contract Analysis Catalogue',
    slug: 'contract-analysis-catalogue',
    description:
      'Catalogue material for laboratory testing capability, instruments, microbiology, physical and chemical testing, sample handling, and analytical support.',
    serviceType: 'Contract Analysis',
    coverImage: '/images/pml/facilities-gallery/analytical-main.jpg',
    fileUrl: null,
    downloadMode: CatalogueDownloadMode.REQUEST_REQUIRED,
    status: PublishStatus.PUBLISHED,
    sortOrder: 3,
  },
];

async function main() {
  for (const catalogue of catalogues) {
    const item = await prisma.catalogueItem.upsert({
      where: {
        slug: catalogue.slug,
      },
      update: catalogue,
      create: catalogue,
    });

    console.log(`✅ Catalogue seeded: ${item.title}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    void prisma.$disconnect();
  });
