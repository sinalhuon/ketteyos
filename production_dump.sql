-- MySQL dump 10.13  Distrib 9.6.0, for macos26.2 (arm64)
--
-- Host: localhost    Database: kettekyu_local
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AlbumPhoto`
--

DROP TABLE IF EXISTS `AlbumPhoto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AlbumPhoto` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `AlbumPhoto_eventId_fkey` (`eventId`),
  CONSTRAINT `AlbumPhoto_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AlbumPhoto`
--

LOCK TABLES `AlbumPhoto` WRITE;
/*!40000 ALTER TABLE `AlbumPhoto` DISABLE KEYS */;
INSERT INTO `AlbumPhoto` VALUES ('004ef563-10dc-4a73-91f2-60f06e05b2ad','1ff6ecea-6895-4e58-9a4a-30e451c19b34','/uploads/album/1770639189769-750f25f7-985c-41b7-9ccb-37fc047b157d.jpg',0,'2026-02-09 12:13:09.790'),('5843b990-8fd7-41d7-8d0b-6502fc8f201f','1ff6ecea-6895-4e58-9a4a-30e451c19b34','/uploads/album/1770639189916-fb5f14f07a31e3332ac835b3047c8bbf.jpg',0,'2026-02-09 12:13:09.925'),('5b9cc1e3-ea47-47ac-89b7-db6f0262f9dc','1ff6ecea-6895-4e58-9a4a-30e451c19b34','/uploads/album/1770639189824-85e1e391876c2c0b133195818e71bab7.jpg',0,'2026-02-09 12:13:09.835'),('678b64b0-a894-4982-9b80-99ac45dc402e','1ff6ecea-6895-4e58-9a4a-30e451c19b34','/uploads/album/1770639189886-bw4a0212.jpg',0,'2026-02-09 12:13:09.896'),('df77b282-c99e-4f4d-aa21-043883b23b1b','1ff6ecea-6895-4e58-9a4a-30e451c19b34','/uploads/album/1770639189855-64789d8235a56f063f74992d1ce17801.jpg',0,'2026-02-09 12:13:09.865');
/*!40000 ALTER TABLE `AlbumPhoto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AppSettings`
--

DROP TABLE IF EXISTS `AppSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AppSettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `appName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'KETTEKYUOS',
  `appLogo` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `updatedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AppSettings_updatedById_fkey` (`updatedById`),
  CONSTRAINT `AppSettings_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppSettings`
--

LOCK TABLES `AppSettings` WRITE;
/*!40000 ALTER TABLE `AppSettings` DISABLE KEYS */;
INSERT INTO `AppSettings` VALUES ('af6cb809-f98f-4e66-afc4-1b827b21fdb2','KETTEYOS','/uploads/branding/logo-1770638225607.png','2026-02-09 11:47:02.507','2026-02-09 13:06:51.675','23192be2-1f95-42fa-ad35-919febd66de2');
/*!40000 ALTER TABLE `AppSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `eventType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wedding',
  `templateId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'premium-gold',
  `musicUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoUrl` text COLLATE utf8mb4_unicode_ci,
  `logoSize` int NOT NULL DEFAULT '150',
  `groomFatherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groomMotherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brideFatherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brideMotherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groomFirstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groomLastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brideFirstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `brideLastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invitationMessage` text COLLATE utf8mb4_unicode_ci,
  `eventTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venueDetails` text COLLATE utf8mb4_unicode_ci,
  `mapUrl` text COLLATE utf8mb4_unicode_ci,
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) DEFAULT NULL,
  `eventDays` text COLLATE utf8mb4_unicode_ci,
  `schedule` text COLLATE utf8mb4_unicode_ci,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Event_slug_key` (`slug`),
  KEY `Event_templateId_fkey` (`templateId`),
  KEY `Event_userId_fkey` (`userId`),
  CONSTRAINT `Event_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `Template` (`codeKey`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES ('1ff6ecea-6895-4e58-9a4a-30e451c19b34','Makara & Fukada','-cwlql','2026-02-27 13:00:00.000','Mid Town',NULL,'wedding','premium-gold','/uploads/music/1770636291537-Piano1.mp3','/uploads/covers/1770639212712-makara.png',277,'លោក ដូណាល់ត្រាំ','អ្នកស្រី អេនជូលីណាជូលី','លោម ចូរ បាដិន','លោកស្រី ម៉ារីអូសាវ៉ា','ហេង','មករា','អ៊ីមិក','ហ្វូកាដា','','','St 2004','https://maps.app.goo.gl/25C3wgb3AqtUJTKc9','2026-02-09 12:11:58.125',NULL,NULL,'[{\"date\":\"2026-02-28\",\"activities\":[{\"time\":\"07:00\",\"activity\":\"ផឹក\"},{\"time\":\"19:00\",\"activity\":\"ផឹក\"}]},{\"date\":\"2026-02-28\",\"activities\":[{\"time\":\"09:00\",\"activity\":\"ផឹក\"},{\"time\":\"21:00\",\"activity\":\"ផឹក\"}]}]','23192be2-1f95-42fa-ad35-919febd66de2','2026-02-09 12:11:58.125','2026-02-09 12:36:33.317');
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalAsset`
--

DROP TABLE IF EXISTS `GlobalAsset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalAsset` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalAsset`
--

LOCK TABLES `GlobalAsset` WRITE;
/*!40000 ALTER TABLE `GlobalAsset` DISABLE KEYS */;
INSERT INTO `GlobalAsset` VALUES ('05312bfc-84b1-426e-9322-a26883bc2f26','Romantic Piano','MUSIC','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3','2026-02-09 11:20:46.830'),('c3b6817f-09a2-4319-a7a3-587e080a4d88','Piano 1','MUSIC','/uploads/music/1770636291537-Piano1.mp3','2026-02-09 11:24:51.546'),('e654d701-8554-4c21-b4f4-ce1ca6522171','Wedding March','MUSIC','https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3','2026-02-09 11:20:46.831');
/*!40000 ALTER TABLE `GlobalAsset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Guest`
--

DROP TABLE IF EXISTS `Guest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Guest` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `eventId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Guest_token_key` (`token`),
  UNIQUE KEY `Guest_shortCode_key` (`shortCode`),
  KEY `Guest_eventId_fkey` (`eventId`),
  CONSTRAINT `Guest_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Guest`
--

LOCK TABLES `Guest` WRITE;
/*!40000 ALTER TABLE `Guest` DISABLE KEYS */;
INSERT INTO `Guest` VALUES ('9eea2733-789f-41e9-9712-3f4dc8cf39fa','Bong Tola',NULL,'GZQ2Y','8134840e-7d81-4e56-ba56-84834e185d7f','PENDING','1ff6ecea-6895-4e58-9a4a-30e451c19b34','099232222'),('af9b98f4-5059-4340-aa60-7105fbf7f520','Me (Preview)',NULL,NULL,'7b6b71ef-2890-4e0c-8da8-3d611d2b1855','OPENED','1ff6ecea-6895-4e58-9a4a-30e451c19b34',NULL),('b64db25f-b097-410a-834a-ec2e38844b2a','Huon Sinal',NULL,'TT0ZI','11a54a70-c8c8-4b56-9748-374fe851f3e2','PENDING','1ff6ecea-6895-4e58-9a4a-30e451c19b34','016662933');
/*!40000 ALTER TABLE `Guest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permission`
--

DROP TABLE IF EXISTS `Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permission`
--

LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` VALUES ('12a9552b-79aa-4548-84e9-e381a4de1ed9','templates.edit','templates','Edit templates','2026-02-09 11:20:46.648'),('235d93cf-3bea-4df2-89ce-0fcc7a3e7791','assets.delete','assets','Delete assets','2026-02-09 11:20:46.651'),('28110fb5-14bd-4a4e-9037-0984d14b8ce2','templates.delete','templates','Delete templates','2026-02-09 11:20:46.649'),('284d9b83-e543-4c4d-9d79-3372daa3de06','assets.upload','assets','Upload new assets','2026-02-09 11:20:46.650'),('2b828de1-654b-418c-9d7a-09fc6dc35663','templates.create','templates','Create templates','2026-02-09 11:20:46.647'),('3ceadb86-5400-48a0-aa7d-611b073b5024','admins.manage','admins','Manage admin users and permissions','2026-02-09 11:20:46.653'),('43dde250-3c47-4496-ac87-107fe1114d24','users.create','users','Create new users','2026-02-09 11:20:46.644'),('65e71189-4ce4-4c2c-81a5-e98fabf44c8c','templates.view','templates','View templates','2026-02-09 11:20:46.646'),('789e0582-d961-40c0-b6d1-9256516b0d61','users.edit','users','Edit user details','2026-02-09 11:20:46.645'),('8a82cefe-2990-4671-aa88-41683ac709f7','events.view_all','events','View all user events','2026-02-09 11:20:46.651'),('8d616347-7483-491b-9009-7413dec12239','events.delete','events','Delete any event','2026-02-09 11:20:46.652'),('9c828309-b8cb-49fe-b894-02db914b05f0','users.view','users','View all users','2026-02-09 11:20:46.628'),('e9923e6a-0339-45fe-bc89-7a613117c273','assets.view','assets','View assets','2026-02-09 11:20:46.650'),('f6a6ffbf-5f52-4235-bbd7-4176057462c8','users.delete','users','Delete users','2026-02-09 11:20:46.645');
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Template`
--

DROP TABLE IF EXISTS `Template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Template` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `previewUrl` text COLLATE utf8mb4_unicode_ci,
  `codeKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `backgroundVideoUrl` text COLLATE utf8mb4_unicode_ci,
  `introVideoUrl` text COLLATE utf8mb4_unicode_ci,
  `transitionVideoUrl` text COLLATE utf8mb4_unicode_ci,
  `effectLayerUrl` text COLLATE utf8mb4_unicode_ci,
  `effectLayerBlendMode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'screen',
  `effectLayerOpacity` double NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Template_codeKey_key` (`codeKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Template`
--

LOCK TABLES `Template` WRITE;
/*!40000 ALTER TABLE `Template` DISABLE KEYS */;
INSERT INTO `Template` VALUES ('22e93f51-42c0-4885-860e-b97716eeea85','Premium Wedding 1','Luxurious gold falling effect with 3D book opening.','/preview-gold.jpg','premium-gold','Wedding',1,'2026-02-09 11:13:40.955','https://ik.imagekit.io/ketteyos/1770281380424-second_screen.mp4?updatedAt=1770632861990','https://ik.imagekit.io/ketteyos/1770281365052-first_screen.mp4?updatedAt=1770632861607','https://ik.imagekit.io/ketteyos/middle%20screen.mov/ik-video.mp4?updatedAt=1770632859146','','screen',0.3),('5107ed4c-35e7-49f1-af3f-eae000be98c4','Birthday Celebration','Fun and colorful birthday theme with confetti.','/preview-birthday.jpg','birthday-celebration','Birthday',1,'2026-02-09 11:13:40.960',NULL,NULL,NULL,NULL,'screen',1),('c0273f7a-a878-46cf-ad94-f7c0dc0f3764','Classic White','Elegant white theme with subtle animations.','/preview-white.jpg','classic-white','Wedding',1,'2026-02-09 11:13:40.958',NULL,NULL,NULL,NULL,'screen',1),('fdc56ac9-f359-466e-b992-5dddb9f535be','Modern Minimal','Clean and modern design with smooth transitions.','/preview-minimal.jpg','modern-minimal','Wedding',1,'2026-02-09 11:13:40.959',NULL,NULL,NULL,NULL,'screen',1);
/*!40000 ALTER TABLE `Template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CLIENT',
  `resetToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resetTokenExpiry` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isSuperAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `profileImage` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_resetToken_key` (`resetToken`),
  KEY `User_createdById_fkey` (`createdById`),
  CONSTRAINT `User_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('23192be2-1f95-42fa-ad35-919febd66de2','sinalhuon@gmail.com','$2b$10$x.hNuT0AORaqJQkv9rKBIe5K2xcWMp9dKOv5NCwKjw6P3aeBAzyYK','Sinal Huon','SUPER_ADMIN',NULL,NULL,'2026-02-09 11:13:40.896',NULL,1,'/uploads/profiles/23192be2-1f95-42fa-ad35-919febd66de2-1770638244074.jpeg'),('56372bef-05ab-4fc3-bdb9-1d14074d36cf','client@test.com','$2b$10$qNiKl2cbvICDbBi73hFpb.pn3LSgY8P6fdN281qhgl3qmrtCpTK8S','Test Client','CLIENT',NULL,NULL,'2026-02-09 11:13:40.954',NULL,0,NULL),('8f8dc77e-5554-4de5-945c-f5f3a110dc33','admin@admin.com','$2b$10$fkUgwFViyvKRxZYDjqzcWORz4Zh1nq/HEnEJj962m/6UgdcLShbxy','Super Owner','SUPER_ADMIN',NULL,NULL,'2026-02-09 11:13:40.837',NULL,1,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserPermission`
--

DROP TABLE IF EXISTS `UserPermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserPermission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `granted` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserPermission_userId_permissionId_key` (`userId`,`permissionId`),
  KEY `UserPermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserPermission`
--

LOCK TABLES `UserPermission` WRITE;
/*!40000 ALTER TABLE `UserPermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserPermission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-10  0:45:05
