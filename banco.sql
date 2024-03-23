CREATE DATABASE  IF NOT EXISTS `ideia2000` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ideia2000`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: ideia2000
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
INSERT INTO `empresas` VALUES (1,'TechSolutions Ltda.'),(2,'InovaSoft S.A.'),(3,'DataTech Inc.'),(4,'SoftWorks Solutions'),(5,'CodeCrafters Ltd.'),(6,'ByteWave Technologies'),(7,'GlobalSoft Solutions'),(8,'SmartCode Systems'),(9,'InfoTech Innovations'),(10,'WebWizards Inc.'),(11,'InovaTec'),(12,'MegaSolutions'),(13,'TechGenius'),(14,'FutureTech'),(15,'DigitalSystems'),(16,'WebMasters'),(17,'SkylineTech'),(18,'NexGenTech'),(19,'InnovativeSolutions'),(20,'AlphaTech'),(21,'FuturTech'),(22,'TechCraft'),(23,'GlobalTech'),(24,'WebWonders'),(25,'BrightIdeas'),(26,'EagleEyeTech'),(27,'StarTech'),(28,'CyberSolutions'),(29,'TechNova'),(30,'SmartTech');
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `empresa_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `empresa_id` (`empresa_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'Suporte Técnico',2),(2,'Desenvolvimento de Software',25),(3,'Soluções de Negócios',27),(4,'Análise de Dados',2),(5,'Consultoria em TI',19),(6,'Gestão de Projetos',28),(7,'Marketing Digital',24),(8,'Design Gráfico',3),(9,'Treinamento de Equipes',2),(10,'Segurança da Informação',3),(11,'Desenvolvimento Web',9),(12,'Suporte ao Cliente',6),(13,'Business Intelligence',3),(14,'Gestão de Recursos Humanos',27),(15,'Cloud Computing',5),(16,'E-commerce',1),(17,'SEO (Search Engine Optimization)',22),(18,'Redes de Computadores',14),(19,'Machine Learning',4),(20,'Desenvolvimento Mobile',9),(21,'Gestão Financeira',1),(22,'Suporte Remoto',7),(23,'Desenvolvimento Frontend',1),(24,'Gestão de Projetos Ágeis',13),(25,'Análise de Big Data',2),(26,'Consultoria em Cloud',29),(27,'Marketing de Conteúdo',20),(28,'Design de Logotipo',11),(29,'Treinamento em Vendas',26),(30,'Segurança de Redes',4),(31,'Desenvolvimento Mobile Nativo',4),(32,'Suporte por Chat',6),(33,'Business Analytics',20),(34,'Recrutamento e Seleção',20),(35,'Computação em Nuvem Híbrida',9),(36,'E-commerce B2B',15),(37,'Otimização de SEO',17),(38,'Administração de Redes',11),(39,'Aprendizado de Máquina Avançado',4),(40,'Desenvolvimento de Aplicativos Híbridos',15),(41,'Gestão de Finanças Empresariais',2),(42,'Gestão de Projetos de TI',25),(43,'Desenvolvimento Backend',28),(44,'Consultoria em Estratégia Digital',6),(45,'Design de Interface do Usuário',7),(46,'Treinamento de Liderança',14),(47,'Segurança Cibernética',21),(48,'Desenvolvimento de Jogos',1),(49,'Análise de Mercado',1),(50,'Marketing de Mídia Social',3);
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'ana_silva','senha123','ana_silva_email@company.com'),(2,'joao_pereira','segredo456','joao_pereira_email@company.com'),(3,'maria_rodrigues','minhasenha','maria_rodrigues_email@company.com'),(4,'pedro_almeida','senhasegura','pedro_almeida_email@company.com'),(5,'carla_nunes','carla123','carla_nunes_email@company.com'),(6,'rafael_santos','senha1234','rafael_santos_email@company.com'),(7,'lucas_oliveira','lucas456','lucas_oliveira_email@company.com'),(8,'camila_costa','camila123','camila_costa_email@company.com'),(9,'bruno_martins','bruno789','bruno_martins_email@company.com'),(10,'julia_rocha','julia789','julia_rocha_email@company.com'),(11,'felipe_pereira','felipe456','felipe_pereira_email@company.com'),(12,'carolina_silveira','carolina123','carolina_silveira_email@company.com'),(13,'gabriel_souza','gabriel789','gabriel_souza_email@company.com'),(14,'leticia_fernandes','leticia123','leticia_fernandes_email@company.com'),(15,'thiago_alves','thiago456','thiago_alves_email@company.com'),(16,'mariana_santana','mariana123','mariana_santana_email@company.com'),(17,'rodrigo_cruz','rodrigo789','rodrigo_cruz_email@company.com'),(18,'patricia_costa','patricia123','patricia_costa_email@company.com'),(19,'leonardo_mendes','leonardo456','leonardo_mendes_email@company.com'),(20,'beatriz_oliveira','beatriz789','beatriz_oliveira_email@company.com'),(83,'john_smith','john123','john_smith@gmail.com'),(84,'mary_johnson','mary456','mary_johnson@yahoo.com'),(85,'michael_williams','michael789','michael_williams@outlook.com'),(86,'jennifer_brown','jennifer123','jennifer_brown@aol.com'),(87,'james_jones','james456','james_jones@icloud.com'),(88,'linda_garcia','linda789','linda_garcia@protonmail.com'),(89,'william_miller','william123','william_miller@live.com'),(90,'patricia_davis','patricia456','patricia_davis@mail.com'),(91,'robert_rodriguez','robert789','robert_rodriguez@zoho.com'),(92,'elizabeth_martinez','elizabeth123','elizabeth_martinez@yandex.com'),(93,'david_hernandez','david456','david_hernandez@inbox.com'),(94,'susan_lopez','susan789','susan_lopez@fastmail.com'),(95,'richard_gonzalez','richard123','richard_gonzalez@protonmail.ch'),(96,'jessica_wilson','jessica456','jessica_wilson@yandex.ru'),(97,'charles_anderson','charles789','charles_anderson@outlook.jp'),(98,'angela_taylor','angela123','angela_taylor@zoho.eu'),(99,'thomas_thomas','thomas456','thomas_thomas@protonmail.ch'),(100,'sarah_jackson','sarah789','sarah_jackson@gmail.co.uk'),(101,'christopher_white','christopher123','christopher_white@icloud.com'),(102,'michelle_harris','michelle456','michelle_harris@yahoo.ca'),(103,'daniel_martin','daniel789','daniel_martin@outlook.fr'),(104,'ashley_thompson','ashley123','ashley_thompson@protonmail.com'),(105,'matthew_garcia','matthew456','matthew_garcia@mail.ru'),(106,'amanda_martinez','amanda789','amanda_martinez@gmail.com.br'),(107,'andrew_robinson','andrew123','andrew_robinson@outlook.in'),(108,'jessica_clark','jessica456','jessica_clark@icloud.com.au'),(109,'joshua_rodriguez','joshua789','joshua_rodriguez@yahoo.de'),(110,'megan_lewis','megan123','megan_lewis@protonmail.com'),(111,'ryan_lee','ryan456','ryan_lee@live.co.uk'),(112,'emily_walker','emily789','emily_walker@outlook.com'),(113,'justin_hall','justin123','justin_hall@gmail.fr'),(114,'laura_allen','laura456','laura_allen@icloud.com'),(115,'brian_young','brian789','brian_young@yahoo.com.br'),(116,'rebecca_hernandez','rebecca123','rebecca_hernandez@mail.com'),(117,'timothy_king','timothy456','timothy_king@outlook.jp'),(118,'nicole_wright','nicole789','nicole_wright@protonmail.com'),(119,'randy_scott','randy123','randy_scott@gmail.com.au'),(120,'samantha_green','samantha456','samantha_green@outlook.co.uk'),(121,'gary_adams','gary789','gary_adams@protonmail.com'),(122,'amanda_baker','amanda123','amanda_baker@live.com'),(123,'brandon_gonzalez','brandon456','brandon_gonzalez@yahoo.com'),(124,'diana_nelson','diana789','diana_nelson@gmail.com'),(125,'jacob_carter','jacob123','jacob_carter@yahoo.co.uk'),(126,'angela_morales','angela456','angela_morales@outlook.com'),(127,'craig_kelly','craig789','craig_kelly@hotmail.com'),(128,'kelly_wood','kelly123','kelly_wood@icloud.com'),(129,'Jeferson_Santos','Jefinho123','jeffinho.santos@ideia2000.com'),(130,'Kevyn_Oliveira','kevyn!123','kevyn.oliveira@ideia2000.com'),(131,'Caetano_Rabelo','Caetaninho123','CJ@ideia2000.com');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-21 22:39:56
