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
    "logoSize" INTEGER NOT NULL DEFAULT 150,
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
INSERT INTO "new_Event" ("brideFatherName", "brideFirstName", "brideLastName", "brideMotherName", "createdAt", "date", "description", "endDate", "eventDays", "eventTime", "eventType", "groomFatherName", "groomFirstName", "groomLastName", "groomMotherName", "id", "invitationMessage", "location", "logoUrl", "mapUrl", "musicUrl", "schedule", "startDate", "templateId", "title", "updatedAt", "userId", "venueDetails") SELECT "brideFatherName", "brideFirstName", "brideLastName", "brideMotherName", "createdAt", "date", "description", "endDate", "eventDays", "eventTime", "eventType", "groomFatherName", "groomFirstName", "groomLastName", "groomMotherName", "id", "invitationMessage", "location", "logoUrl", "mapUrl", "musicUrl", "schedule", "startDate", "templateId", "title", "updatedAt", "userId", "venueDetails" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
