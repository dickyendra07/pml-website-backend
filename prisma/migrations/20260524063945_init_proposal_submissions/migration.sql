-- CreateTable
CREATE TABLE "ProposalSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "serviceType" TEXT NOT NULL,
    "projectNeeds" TEXT NOT NULL,
    "sourcePage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalSubmission_pkey" PRIMARY KEY ("id")
);
