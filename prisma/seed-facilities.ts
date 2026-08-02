import { PrismaClient, PublishStatus } from '@prisma/client';

const facilities = [
  {
    key: 'clinical-facilities',
    titleEn: 'Clinical Facilities',
    titleId: null,
    eyebrowEn: 'Clinical Study Support',
    eyebrowId: null,
    summaryEn:
      'Clinical facility support for controlled study activities, including expanded 70-bed capacity, screening and dosing areas, experienced clinical research staff, and 24-hour medical support.',
    summaryId: null,
    contentEn:
      'Clinical facility support for controlled study activities, including expanded 70-bed capacity, screening and dosing areas, experienced clinical research staff, and 24-hour medical support.',
    contentId: null,
    image:
      '/images/pml/facilities/photos/pml-facility-photo-09.png',
    gallery: [
      {
        id: 'clinical-1',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-09.png',
        sortOrder: 1,
      },
      {
        id: 'clinical-2',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-05.png',
        sortOrder: 2,
      },
      {
        id: 'clinical-3',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-14.png',
        sortOrder: 3,
      },
      {
        id: 'clinical-4',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-08.png',
        sortOrder: 4,
      },
      {
        id: 'clinical-5',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-15.png',
        sortOrder: 5,
      },
      {
        id: 'clinical-6',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-16.png',
        sortOrder: 6,
      },
    ],
    pointsEn: [
      '70-bed clinical facility capacity',
      'Dedicated screening and dosing area',
      'Experienced clinical research staff',
      '24-hour medical support',
      'Healthy volunteer database support',
      'Ambulance support for study operations',
    ],
    pointsId: [],
    category: 'clinical',
    status: PublishStatus.PUBLISHED,
    sortOrder: 1,
  },

  {
    key: 'analytical-facilities',
    titleEn: 'Analytical Facilities',
    titleId: null,
    eyebrowEn: 'Laboratory Capability',
    eyebrowId: null,
    summaryEn:
      'Analytical laboratory capability supported by instruments and workflows for bioanalysis, contract analysis, product testing, documentation, and regulatory-ready reporting.',
    summaryId: null,
    contentEn:
      'Analytical laboratory capability supported by instruments and workflows for bioanalysis, contract analysis, product testing, documentation, and regulatory-ready reporting.',
    contentId: null,
    image:
      '/images/pml/facilities/photos/pml-facility-photo-01.png',
    gallery: [
      {
        id: 'analytical-1',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-01.png',
        sortOrder: 1,
      },
      {
        id: 'analytical-2',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-17.png',
        sortOrder: 2,
      },
      {
        id: 'analytical-3',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-02.png',
        sortOrder: 3,
      },
      {
        id: 'analytical-4',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-04.png',
        sortOrder: 4,
      },
      {
        id: 'analytical-5',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-07.png',
        sortOrder: 5,
      },
      {
        id: 'analytical-6',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-10.png',
        sortOrder: 6,
      },
      {
        id: 'analytical-7',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-11.png',
        sortOrder: 7,
      },
      {
        id: 'analytical-8',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-12.png',
        sortOrder: 8,
      },
      {
        id: 'analytical-9',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-13.png',
        sortOrder: 9,
      },
      {
        id: 'analytical-10',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-20.png',
        sortOrder: 10,
      },
    ],
    pointsEn: [
      'LC-MS/MS analytical support',
      'GC-FID and GC-MS capability',
      'ICP-OES support',
      'HPLC analytical workflow',
      'Bioanalytical method support',
      'Laboratory documentation and reporting',
    ],
    pointsId: [],
    category: 'analytical',
    status: PublishStatus.PUBLISHED,
    sortOrder: 2,
  },

  {
    key: 'supporting-facilities',
    titleEn: 'Supporting Facilities',
    titleId: null,
    eyebrowEn: 'Operational Support',
    eyebrowId: null,
    summaryEn:
      'Supporting facility infrastructure for reliable study and laboratory operations, including drug storage, archive room, sample handling, and study operation support.',
    summaryId: null,
    contentEn:
      'Supporting facility infrastructure for reliable study and laboratory operations, including drug storage, archive room, sample handling, and study operation support.',
    contentId: null,
    image:
      '/images/pml/facilities/photos/pml-facility-photo-03.png',
    gallery: [
      {
        id: 'supporting-1',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-03.png',
        sortOrder: 1,
      },
      {
        id: 'supporting-2',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-18.png',
        sortOrder: 2,
      },
      {
        id: 'supporting-3',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-21.png',
        sortOrder: 3,
      },
      {
        id: 'supporting-4',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-22.png',
        sortOrder: 4,
      },
      {
        id: 'supporting-5',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-23.png',
        sortOrder: 5,
      },
    ],
    pointsEn: [
      'Drug storage room',
      'Archive room',
      'Sample receiving and handling support',
      'Study operation infrastructure',
      'Documentation workflow support',
      'Project coordination support',
    ],
    pointsId: [],
    category: 'supporting',
    status: PublishStatus.PUBLISHED,
    sortOrder: 3,
  },

  {
    key: 'vr-gallery',
    titleEn: 'VR Gallery',
    titleId: null,
    eyebrowEn: 'Facility Experience',
    eyebrowId: null,
    summaryEn:
      'Interactive facility experience that allows visitors and sponsors to explore PML facility visuals through the official VR tour gallery.',
    summaryId: null,
    contentEn:
      'Interactive facility experience that allows visitors and sponsors to explore PML facility visuals through the official VR tour gallery.',
    contentId: null,
    image:
      '/images/pml/facilities/photos/pml-facility-photo-17.png',
    gallery: [
      {
        id: 'vr-1',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-17.png',
        sortOrder: 1,
      },
      {
        id: 'vr-2',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-09.png',
        sortOrder: 2,
      },
      {
        id: 'vr-3',
        image:
          '/images/pml/facilities/photos/pml-facility-photo-03.png',
        sortOrder: 3,
      },
    ],
    pointsEn: [
      'Interactive VR facility tour',
      'Visual overview of PML environment',
      'External VR gallery access',
      'Useful for sponsor introduction',
      'Supports remote facility review',
      'Direct link to official VR experience',
    ],
    pointsId: [],
    category: 'vr-gallery',
    status: PublishStatus.PUBLISHED,
    sortOrder: 4,
  },
];

export async function seedFacilities(prisma: PrismaClient) {
  for (const facility of facilities) {
    const item = await prisma.facility.upsert({
      where: {
        key: facility.key,
      },
      update: {},
      create: facility,
    });

    console.log(`✅ Facility seeded: ${item.titleEn}`);
  }
}
