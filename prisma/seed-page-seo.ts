import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pages = [
  {
    path: "/",
    label: "Home",
    title: "Pharma Metric Labs | Contract Research Organization in Indonesia",
    description:
      "Pharma Metric Labs is an integrated Contract Research Organization in Indonesia supporting BA/BE studies, clinical trials, contract analysis, and regulatory consultation.",
    ogTitle: "Pharma Metric Labs | CRO Indonesia",
    ogDescription:
      "Integrated CRO services for pharmaceutical development, including BA/BE studies, clinical trials, contract analysis, and regulatory consultation.",
  },
  {
    path: "/about-us",
    label: "About Us",
    title: "About Pharma Metric Labs",
    description:
      "Learn about Pharma Metric Labs, an independent CRO in Indonesia with multidisciplinary expertise, scientific integrity, and reliable study execution support.",
    ogTitle: "About Pharma Metric Labs",
    ogDescription:
      "Discover PML’s capability, experience, quality standards, expert team, and CRO service focus.",
  },
  {
    path: "/services",
    label: "Services",
    title: "CRO Services",
    description:
      "Explore Pharma Metric Labs integrated CRO services for BA/BE studies, clinical trials, contract analysis, and regulatory consultation.",
    ogTitle: "CRO Services",
    ogDescription:
      "Explore Pharma Metric Labs integrated CRO services for BA/BE studies, clinical trials, contract analysis, and regulatory consultation.",
  },
  {
    path: "/services/babe-studies",
    label: "BA/BE Studies",
    title: "BA/BE Studies",
    description:
      "End-to-end bioavailability and bioequivalence study support from clinical conduct and bioanalysis to regulatory-ready reporting.",
    ogTitle: "BA/BE Studies",
    ogDescription:
      "PML supports BA/BE studies with clinical conduct, bioanalysis, quality documentation, and regulatory-ready reporting.",
  },
  {
    path: "/services/clinical-trial",
    label: "Clinical Trial Services",
    title: "Clinical Trial Services",
    description:
      "Clinical research support across study planning, regulatory coordination, site management, monitoring, and medical writing.",
    ogTitle: "Clinical Trial Services",
    ogDescription:
      "PML provides clinical trial support with local expertise, hospital partnerships, and global study experience.",
  },
  {
    path: "/services/contract-analysis",
    label: "Contract Analysis",
    title: "Contract Analysis",
    description:
      "Reliable analytical testing support for product quality, safety, compliance, and documentation needs across regulated industries.",
    ogTitle: "Contract Analysis",
    ogDescription:
      "Analytical testing services for pharmaceutical, cosmetic, food, beverage, and medical device industries.",
  },
  {
    path: "/services/regulatory-consultation",
    label: "Regulatory Consultation",
    title: "Regulatory Consultation",
    description:
      "Regulatory affairs support for BPOM registration, ACTD documents, compliance, and submission readiness.",
    ogTitle: "Regulatory Consultation",
    ogDescription:
      "PML helps support product registration, compliance documentation, and local regulatory submission requirements.",
  },
  {
    path: "/facilities",
    label: "Facilities",
    title: "Facilities & Capability",
    description:
      "Explore Pharma Metric Labs clinical, analytical, and supporting facilities for reliable study execution and laboratory operations.",
    ogTitle: "Facilities & Capability",
    ogDescription:
      "PML supports clinical, analytical, and operational needs through integrated facilities and documentation workflows.",
  },
  {
    path: "/facilities/clinical-facilities",
    label: "Clinical Facilities",
    title: "Clinical Facilities",
    description:
      "Explore PML clinical facilities designed to support controlled study activities, volunteer management, and clinical operations.",
    ogTitle: "Clinical Facilities",
    ogDescription:
      "Clinical facility support for reliable study conduct and controlled clinical research activities.",
  },
  {
    path: "/facilities/analytical-facilities",
    label: "Analytical Facilities",
    title: "Analytical Facilities",
    description:
      "Explore PML analytical laboratory capabilities including LC-MS/MS, GC-FID, GC-MS, ICP-OES, HPLC, and related instruments.",
    ogTitle: "Analytical Facilities",
    ogDescription:
      "Analytical laboratory capabilities for reliable bioanalysis, quality testing, and regulated documentation needs.",
  },
  {
    path: "/facilities/supporting-facilities",
    label: "Supporting Facilities",
    title: "Supporting Facilities",
    description:
      "Explore supporting facilities including drug storage, archive room, ambulance support, and study operations infrastructure.",
    ogTitle: "Supporting Facilities",
    ogDescription:
      "Supporting infrastructure for study operations, documentation, storage, and project execution needs.",
  },
  {
    path: "/facilities/vr-gallery",
    label: "VR Gallery",
    title: "VR Gallery",
    description:
      "Explore Pharma Metric Labs facility visuals and approved gallery materials through the VR gallery page.",
    ogTitle: "VR Gallery",
    ogDescription:
      "View PML facility visuals and gallery materials for better understanding of its operational capability.",
  },
  {
    path: "/contact",
    label: "Contact Us",
    title: "Contact Us",
    description:
      "Contact Pharma Metric Labs to discuss CRO services, BA/BE studies, clinical trials, contract analysis, regulatory consultation, and project inquiries.",
    ogTitle: "Contact Pharma Metric Labs",
    ogDescription:
      "Submit your inquiry and connect with PML to discuss the right CRO service scope for your project.",
  },
  {
    path: "/insight",
    label: "Insight",
    title: "Insight",
    description:
      "Explore Pharma Metric Labs articles, news, publications, and FAQ content about CRO services, BA/BE studies, clinical trials, and pharmaceutical development.",
    ogTitle: "PML Insight",
    ogDescription:
      "Educational resources about CRO services, BA/BE studies, clinical trials, regulatory topics, and project readiness.",
  },
  {
    path: "/insight/articles",
    label: "Articles",
    title: "Articles",
    description:
      "Read educational articles from Pharma Metric Labs about CRO services, BA/BE studies, clinical trials, and pharmaceutical development.",
    ogTitle: "Articles",
    ogDescription:
      "Educational content about CRO services, BA/BE studies, clinical trials, and pharma development topics.",
  },
  {
    path: "/insight/news",
    label: "News",
    title: "News",
    description:
      "Read updates and news from Pharma Metric Labs related to CRO services, company activities, and pharmaceutical development support.",
    ogTitle: "News",
    ogDescription:
      "Latest updates from Pharma Metric Labs and service-related activities.",
  },
  {
    path: "/insight/publications",
    label: "Publications",
    title: "Publications",
    description:
      "Explore Pharma Metric Labs publications and references related to scientific, regulatory, and pharmaceutical documentation topics.",
    ogTitle: "Publications",
    ogDescription:
      "Scientific, regulatory, and documentation-related references from Pharma Metric Labs.",
  },
  {
    path: "/insight/faq",
    label: "FAQ",
    title: "FAQ",
    description:
      "Find answers to common questions about Pharma Metric Labs services, inquiry preparation, BA/BE studies, clinical trials, and regulatory support.",
    ogTitle: "FAQ",
    ogDescription:
      "Common questions about PML services, inquiry preparation, and CRO project support.",
  },
];

async function main() {
  for (const page of pages) {
    await prisma.pageSeo.upsert({
      where: { path: page.path },
      update: page,
      create: {
        ...page,
        status: "PUBLISHED",
      },
    });

    console.log(`✅ SEO synced: ${page.path}`);
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
