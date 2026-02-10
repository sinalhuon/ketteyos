-- AlterTable
ALTER TABLE `User` ADD COLUMN `resetToken` VARCHAR(191) NULL UNIQUE,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
