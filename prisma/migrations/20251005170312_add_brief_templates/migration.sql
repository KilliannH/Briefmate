-- CreateTable
CREATE TABLE "BriefTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "estimatedHours" DOUBLE PRECISION,
    "tasks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BriefTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BriefTemplate_userId_idx" ON "BriefTemplate"("userId");

-- AddForeignKey
ALTER TABLE "BriefTemplate" ADD CONSTRAINT "BriefTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
