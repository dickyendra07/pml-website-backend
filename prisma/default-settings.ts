import type { Prisma } from '@prisma/client';

export type SettingInput = {
  key: string;
  label: string;
  value: Prisma.InputJsonValue;
  group?: string;
  description?: string;
  isPublic?: boolean;
};

export const defaultSettings: SettingInput[] = [
  {
    key: 'company.name',
    label: 'Company Name',
    value: 'Pharma Metric Labs',
    group: 'company',
    description: 'Official company name displayed across the website.',
    isPublic: true,
  },
  {
    key: 'company.description',
    label: 'Company Description',
    value:
      'Pharma Metric Labs supports pharmaceutical and biotechnology companies with scientific CRO services for BA/BE studies, clinical trials, contract analysis, and regulatory consultation.',
    group: 'company',
    description:
      'Default company description for footer and website summaries.',
    isPublic: true,
  },
  {
    key: 'contact.address',
    label: 'Office Address',
    value:
      'Gedung Indra Sentral Unit R & T, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia',
    group: 'contact',
    description: 'Primary office address.',
    isPublic: true,
  },
  {
    key: 'contact.phone',
    label: 'Phone Number',
    value: '(+6221) 426 5310 / (+6221) 426 9475',
    group: 'contact',
    description: 'Primary phone number.',
    isPublic: true,
  },
  {
    key: 'contact.email',
    label: 'Primary Email',
    value: 'info@pharmametriclabs.com',
    group: 'contact',
    description: 'Primary public email.',
    isPublic: true,
  },
  {
    key: 'contact.secondaryEmail',
    label: 'Secondary Email',
    value: 'Novida.aristyowati@pharmametriclabs.com',
    group: 'contact',
    description: 'Secondary contact email.',
    isPublic: true,
  },
  {
    key: 'social.linkedin',
    label: 'LinkedIn URL',
    value: 'https://www.linkedin.com',
    group: 'social',
    description: 'LinkedIn profile URL.',
    isPublic: true,
  },
  {
    key: 'social.instagram',
    label: 'Instagram URL',
    value: 'https://www.instagram.com',
    group: 'social',
    description: 'Instagram profile URL.',
    isPublic: true,
  },
  {
    key: 'footer.copyright',
    label: 'Footer Copyright',
    value: 'Pharma Metric Labs. All rights reserved.',
    group: 'footer',
    description: 'Footer copyright text.',
    isPublic: true,
  },
  {
    key: 'proposal.recipientEmail',
    label: 'Proposal Recipient Email',
    value: 'info@pharmametriclabs.com',
    group: 'proposal',
    description: 'Email recipient for proposal notifications.',
    isPublic: false,
  },
  {
    key: 'seo.defaultTitle',
    label: 'Default SEO Title',
    value: 'Pharma Metric Labs | Contract Research Organization in Indonesia',
    group: 'seo',
    description: 'Default meta title for website pages.',
    isPublic: true,
  },
  {
    key: 'seo.defaultDescription',
    label: 'Default SEO Description',
    value:
      'Integrated CRO services for pharmaceutical development, including BA/BE studies, clinical trial services, contract analysis, and regulatory consultation.',
    group: 'seo',
    description: 'Default meta description for website pages.',
    isPublic: true,
  },
];
