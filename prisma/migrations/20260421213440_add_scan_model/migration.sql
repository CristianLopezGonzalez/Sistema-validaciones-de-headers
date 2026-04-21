-- CreateTable
CREATE TABLE "scans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "score" INTEGER,
    "totalIssues" INTEGER NOT NULL DEFAULT 0,
    "criticalIssues" INTEGER NOT NULL DEFAULT 0,
    "highIssues" INTEGER NOT NULL DEFAULT 0,
    "mediumIssues" INTEGER NOT NULL DEFAULT 0,
    "lowIssues" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "scans_userId_createdAt_idx" ON "scans"("userId", "createdAt");
