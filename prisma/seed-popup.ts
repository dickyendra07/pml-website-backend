import { PrismaClient, PopupType, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const popup = await prisma.popupAnnouncement.upsert({
    where: {
      id: 'homepage-popup-demo',
    },
    update: {
      title: 'Discuss Your Next CRO Project with PML',
      description:
        'Connect with Pharma Metric Labs to explore BA/BE studies, clinical trial support, contract analysis, and regulatory consultation for your next pharmaceutical development project.',
      buttonLabel: 'Request a Proposal',
      buttonUrl: '/contact',
      imageUrl: '/images/pml/hero-lab-hexagon.png',
      type: PopupType.INFORMATION,
      status: PublishStatus.PUBLISHED,
      placementPages: ['/'],
      frequency: 'ONCE_PER_SESSION',
      startsAt: null,
      endsAt: null,
      priority: 10,
    },
    create: {
      id: 'homepage-popup-demo',
      title: 'Discuss Your Next CRO Project with PML',
      description:
        'Connect with Pharma Metric Labs to explore BA/BE studies, clinical trial support, contract analysis, and regulatory consultation for your next pharmaceutical development project.',
      buttonLabel: 'Request a Proposal',
      buttonUrl: '/contact',
      imageUrl: '/images/pml/hero-lab-hexagon.png',
      type: PopupType.INFORMATION,
      status: PublishStatus.PUBLISHED,
      placementPages: ['/'],
      frequency: 'ONCE_PER_SESSION',
      startsAt: null,
      endsAt: null,
      priority: 10,
    },
  });

  console.log(`✅ Popup seeded: ${popup.title}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
