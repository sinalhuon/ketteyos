/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Event` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "AlbumPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AlbumPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "templateId" TEXT NOT NULL DEFAULT 'premium-gold',
    "musicUrl" TEXT,
    "logoUrl" TEXT,
    "groomFatherName" TEXT,
    "groomMotherName" TEXT,
    "brideFatherName" TEXT,
    "brideMotherName" TEXT,
    "groomFirstName" TEXT,
    "groomLastName" TEXT,
    "brideFirstName" TEXT,
    "brideLastName" TEXT,
    "invitationMessage" TEXT,
    "eventTime" TEXT,
    "venueDetails" TEXT,
    "mapUrl" TEXT,
    "schedule" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("codeKey") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("createdAt", "date", "description", "id", "location", "logoUrl", "musicUrl", "templateId", "title", "updatedAt", "userId") SELECT "createdAt", "date", "description", "id", "location", "logoUrl", "musicUrl", "templateId", "title", "updatedAt", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
