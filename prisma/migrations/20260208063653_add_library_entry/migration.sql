/*
  Warnings:

  - You are about to alter the column `completed` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN "githubUrl" TEXT;
ALTER TABLE "Post" ADD COLUMN "summary" TEXT;
ALTER TABLE "Post" ADD COLUMN "title" TEXT;

-- CreateTable
CREATE TABLE "LibraryEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "meetingNotes" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "magiVote" TEXT NOT NULL,
    "seeleVote" TEXT NOT NULL,
    "nervVote" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'CURATED',
    "curatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cycleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LibraryEntry_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Todo" ("completed", "createdAt", "id", "priority", "title", "updatedAt") SELECT "completed", "createdAt", "id", "priority", "title", "updatedAt" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "LibraryEntry_postId_key" ON "LibraryEntry"("postId");
