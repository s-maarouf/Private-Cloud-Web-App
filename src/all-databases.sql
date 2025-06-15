-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: cloudstack
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `class_group`
--

DROP TABLE IF EXISTS `class_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_group`
--

LOCK TABLES `class_group` WRITE;
/*!40000 ALTER TABLE `class_group` DISABLE KEYS */;
INSERT INTO `class_group` VALUES (2,'1SRI'),(3,'2CG'),(1,'2SRI');
/*!40000 ALTER TABLE `class_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subject`
--

DROP TABLE IF EXISTS `class_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subject` (
  `class_id` int NOT NULL,
  `subject_id` int NOT NULL,
  PRIMARY KEY (`class_id`,`subject_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `class_subject_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class_group` (`id`),
  CONSTRAINT `class_subject_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subject`
--

LOCK TABLES `class_subject` WRITE;
/*!40000 ALTER TABLE `class_subject` DISABLE KEYS */;
INSERT INTO `class_subject` VALUES (1,1),(2,1),(1,2),(2,2),(2,3),(3,3),(2,4),(3,4);
/*!40000 ALTER TABLE `class_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab`
--

DROP TABLE IF EXISTS `lab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `subject_id` int NOT NULL,
  `created_by` int NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `creation_date` datetime DEFAULT NULL,
  `approval_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `lab_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`),
  CONSTRAINT `lab_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab`
--

LOCK TABLES `lab` WRITE;
/*!40000 ALTER TABLE `lab` DISABLE KEYS */;
/*!40000 ALTER TABLE `lab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `user_id` int NOT NULL,
  `class_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `student_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (6,1),(8,1),(12,2),(13,3);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_lab_progress`
--

DROP TABLE IF EXISTS `student_lab_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_lab_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `lab_id` int NOT NULL,
  `progress` float DEFAULT NULL,
  `last_saved` datetime DEFAULT NULL,
  `work_data` text,
  `status` enum('not_started','in_progress','completed') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`,`lab_id`),
  KEY `lab_id` (`lab_id`),
  CONSTRAINT `student_lab_progress_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `user` (`id`),
  CONSTRAINT `student_lab_progress_ibfk_2` FOREIGN KEY (`lab_id`) REFERENCES `lab` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_lab_progress`
--

LOCK TABLES `student_lab_progress` WRITE;
/*!40000 ALTER TABLE `student_lab_progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_lab_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (4,'Anglais'),(3,'Arabe'),(2,'Développement informatique '),(1,'Réseau Informatique');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_assignment`
--

DROP TABLE IF EXISTS `teacher_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_assignment` (
  `teacher_id` int NOT NULL,
  `class_id` int NOT NULL,
  `subject_id` int NOT NULL,
  PRIMARY KEY (`teacher_id`,`class_id`,`subject_id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `teacher_assignment_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `user` (`id`),
  CONSTRAINT `teacher_assignment_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `class_group` (`id`),
  CONSTRAINT `teacher_assignment_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_assignment`
--

LOCK TABLES `teacher_assignment` WRITE;
/*!40000 ALTER TABLE `teacher_assignment` DISABLE KEYS */;
INSERT INTO `teacher_assignment` VALUES (5,1,1),(9,1,2),(5,2,1),(9,2,2),(10,2,3),(11,2,4),(10,3,3),(11,3,4);
/*!40000 ALTER TABLE `teacher_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher','administrator') NOT NULL,
  `name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'testmail1@gmail.com','scrypt:32768:8:1$26TeBrD1Bvk6c3DV$e662dd8db4628e1a22e0780ee307eff22e72deb461c801e886dc92c2821b649c8e0b460b771295f397d648e5c140362d4f98d2bc161a845fbe5c7df068716664','administrator','Maarouf','Salah Eddine'),(4,'testmail4@gmail.com','scrypt:32768:8:1$yothhQ13oDYQ6ek5$02c02e89d426a031915c7ea3f06d53143d17f6dca37fe4f9791c8ac009f346765eaee16dd008fd28f85d3bab93f4beaad8b28e839ff9baa6b80322aa267a4901','administrator','Elfatine','Zaid'),(5,'testmail2@gmail.com','scrypt:32768:8:1$d5bg4vrZahpR9Wkq$29611359beb0122470e2f5e5862fa1f191e30a53b1376745bcb67635ec543dc9ebe5be2480668835e933b94f9cf7513e8422d2825aabf185f419fbbf81a5ce7a','teacher','Ouadfel','Rachida'),(6,'testmail3@gmail.com','scrypt:32768:8:1$obacWilfQrSu06ge$93578c0c33636a0a5262dc6234632fc37d291210f0da936c726f35bb107bb9ada215c4c356864d3c4af747642c9bc01527646170675ebc353709d3f3ea1e3ba5','student','Boudouche','Ali'),(8,'testmail6@gmail.com','scrypt:32768:8:1$jMpg5zlbY1L2jyFm$8f5bceabd7752f3c70bb77c9af074e83f1e40c60c0acfe0c20578e3241fcca340f8f8b8c05abe277d144759e4949a623f57444e7186c486b1c3d9e543e935643','student','Ferhan','Fouad'),(9,'testmail7@gmail.com','scrypt:32768:8:1$GdUpvvdoxONoCiZ3$411a62794d8cc51144c19582b8df76843af24a1f0815e683fa0eafb289cd556807b6eda4610db1276faf8426c072b9b01e165076e742a4cc16d1fb58bfa848e5','teacher','Dinia','Khadija'),(10,'testmail8@gmail.com','scrypt:32768:8:1$Y8sAS2549v3NBhbJ$9a81c40d0ad262d703cc263f7b870271cffa15c9109036f3de9786fbb6e35cc5049b79e2797d674131f132467d63ca39847d8124158874ff91e01cf2623c852b','teacher','Bakhouch','Jamal'),(11,'testmail9@gmail.com','scrypt:32768:8:1$NoWGwbHHOPDvotIc$63fcd12e5508930d20143407bc46e2fa6b0cbf06898767d656624ebe3d26b738ce1d8da4e99eacee1f3bbe1616840f74c6c2e6851195a5bade572af0d7575688','teacher','El Omari','Moulay Youssef'),(12,'testmail10@gmail.com','scrypt:32768:8:1$ONfbFZgQTeTNXVds$dbb5e3a59be5726a18fe408b4de0d14be64359ff08872fafa9fbfefbc68049ee0e9d9d60020f27fe583a120749ad5b9523fa1680d79c72ab966c653c1e0e36a2','student','Boutaher','Bilal'),(13,'testmail11@gmail.com','scrypt:32768:8:1$dZ7Dh3EO3NedJx7A$1dc2364ae9a87884b9489d073234f73d98f8b2f51cd2e35b6634a00720326d858d5326aef7f7b67e18763c8c7640e390af813b3f532af17108f338248bcf57a3','student','Elkhlyfi','Nour');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-15 13:43:24
