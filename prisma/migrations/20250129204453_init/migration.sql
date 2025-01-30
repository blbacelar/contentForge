-- CreateTable
CREATE TABLE "ContentResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "expertiseAreas" TEXT[],
    "variations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentResult_pkey" PRIMARY KEY ("id")
);
