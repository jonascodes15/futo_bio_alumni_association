-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('SUGGESTION', 'NEWSLETTER_SUBSCRIBE', 'INQUIRY');

-- CreateTable
CREATE TABLE "AlumniCensus" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gradYear" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "currentCity" TEXT NOT NULL,
    "currentCountry" TEXT NOT NULL,
    "industrySector" TEXT NOT NULL,
    "currentRole" TEXT,
    "company" TEXT,
    "interestedInMentorship" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniCensus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlumniCensus_email_key" ON "AlumniCensus"("email");

-- CreateIndex
CREATE INDEX "AlumniCensus_gradYear_idx" ON "AlumniCensus"("gradYear");

-- CreateIndex
CREATE INDEX "AlumniCensus_industrySector_idx" ON "AlumniCensus"("industrySector");

-- CreateIndex
CREATE INDEX "AlumniCensus_currentCountry_idx" ON "AlumniCensus"("currentCountry");

-- CreateIndex
CREATE INDEX "FeedbackMessage_isRead_idx" ON "FeedbackMessage"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
