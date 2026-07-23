import { PrismaClient, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

const features = [
  {
    title: 'Integrated CRO Services',
    description:
      'Highlight PML’s integrated capability across BA/BE studies, clinical trial services, contract analysis, and regulatory consultation.',
    type: 'homepage_highlight',
    referenceId: 'services',
    imageUrl: '/images/pml/hero-lab-hexagon.png',
    buttonLabel: 'Explore Services',
    buttonUrl: '/services',
    status: PublishStatus.PUBLISHED,
    sortOrder: 1,
  },
  {
    title: 'Request a Proposal',
    description:
      'Invite sponsors and partners to discuss project needs, study scope, documents, timeline, and next steps with PML.',
    type: 'homepage_cta',
    referenceId: 'proposal',
    imageUrl: '/images/pml/cta-lab-background.png',
    buttonLabel: 'Request Proposal',
    buttonUrl: '/contact',
    status: PublishStatus.PUBLISHED,
    sortOrder: 2,
  },
  {
    title: 'Latest PML Insights',
    description:
      'Feature selected articles, news, publications, and FAQ content for better sponsor readiness.',
    type: 'homepage_insight',
    referenceId: 'insight',
    imageUrl: '/images/pml/facilities-gallery/analytical-main.jpg',
    buttonLabel: 'View Insight',
    buttonUrl: '/insight',
    status: PublishStatus.PUBLISHED,
    sortOrder: 3,
  },
];

async function main() {
  for (const feature of features) {
    const existing = await prisma.homepageFeature.findFirst({
      where: {
        type: feature.type,
        referenceId: feature.referenceId,
      },
    });

    const item = existing
      ? await prisma.homepageFeature.update({
          where: { id: existing.id },
          data: feature,
        })
      : await prisma.homepageFeature.create({
          data: feature,
        });

    console.log(`✅ Homepage feature seeded: ${item.title}`);
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
