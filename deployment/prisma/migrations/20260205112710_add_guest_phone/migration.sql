/*
  Warnings:

  - You are about to drop the column `slug` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `shortToken` on the `Guest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "eventType" TEXT NOT NULL DEFAULT 'wedding',
    "templateId" TEXT NOT NULL DEFAULT 'premium-gold',
    "musicUrl" TEXT,
    "logoUrl" TEXT,
    "logoSize" INTEGER NOT NULL DEFAULT 160,
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
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "eventDays" TEXT,
    "schedule" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("codeKey") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("brideFatherName", "brideFirstName", "brideLastName", "brideMotherName", "createdAt", "date", "description", "endDate", "eventDays", "eventTime", "eventType", "groomFatherName", "groomFirstName", "groomLastName", "groomMotherName", "id", "invitationMessage", "location", "logoSize", "logoUrl", "mapUrl", "musicUrl", "schedule", "startDate", "templateId", "title", "updatedAt", "userId", "venueDetails") SELECT "brideFatherName", "brideFirstName", "brideLastName", "brideMotherName", "createdAt", "date", "description", "endDate", "eventDays", "eventTime", "eventType", "groomFatherName", "groomFirstName", "groomLastName", "groomMotherName", "id", "invitationMessage", "location", "logoSize", "logoUrl", "mapUrl", "musicUrl", "schedule", "startDate", "templateId", "title", "updatedAt", "userId", "venueDetails" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("email", "eventId", "id", "name", "status", "token") SELECT "email", "eventId", "id", "name", "status", "token" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
