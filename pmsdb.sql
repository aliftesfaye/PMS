-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 06, 2024 at 11:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pmsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `activity_status` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_milestone` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `project_id`, `name`, `description`, `activity_status`, `start_date`, `end_date`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletedAt`, `deletedBy`, `is_milestone`) VALUES
('404060b6-ae3d-4fe7-9c27-29b91b36b253', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 'Test activity', 'Hello', 'on Progress', '2024-07-29 00:00:00', '2024-08-07 00:00:00', NULL, NULL, '2024-07-29 06:05:26', '2024-07-30 13:42:00', 1, NULL, '0968dca1-d770-4762-ab55-cee664225974', 1),
('7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 'dfs', 'sdfsf', 'Pending', '2024-08-19 00:00:00', '2024-09-07 00:00:00', NULL, NULL, '2024-08-20 07:47:06', '2024-08-20 07:47:06', 0, NULL, NULL, 0),
('84905c6b-5119-4107-98f3-0b077912b565', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 'Test Activity', 'sd', 'Pending', '2024-08-26 00:00:00', '2024-10-02 00:00:00', NULL, NULL, '2024-08-26 03:20:54', '2024-08-26 03:20:54', 0, NULL, NULL, 0),
('f8896a71-752a-471f-a17b-83154cf153cc', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 'fd', 'df', 'Pending', '2024-07-29 00:00:00', '2024-08-10 00:00:00', NULL, NULL, '2024-07-30 13:42:25', '2024-07-30 13:42:25', 0, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `activity_members`
--

CREATE TABLE `activity_members` (
  `activity_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_members`
--

INSERT INTO `activity_members` (`activity_member_id`, `activity_id`, `project_member_id`, `createdAt`, `updatedAt`, `is_deleted`, `deletedAt`, `deletedBy`) VALUES
('09cd19c4-1fb8-4766-b90b-389e5dc80045', 'f8896a71-752a-471f-a17b-83154cf153cc', '00678235-c129-4474-8dc3-0593881e2850', '2024-07-30 13:42:25', '2024-07-30 13:42:25', 0, NULL, NULL),
('0d8ec174-3c9c-46e4-9977-6a8dd429c87e', '84905c6b-5119-4107-98f3-0b077912b565', 'fdf44d32-36f5-4b85-a0d2-35977ac12060', '2024-08-26 03:20:55', '2024-08-26 03:20:55', 0, NULL, NULL),
('685966d2-4c75-46c4-869d-38c53e8a9b7a', '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'db47fb29-d857-46d5-acfc-fc5bdcf764b2', '2024-08-20 07:47:07', '2024-08-20 07:47:07', 0, NULL, NULL),
('8507311c-ecdf-4571-81aa-b15c4d64ee25', '84905c6b-5119-4107-98f3-0b077912b565', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', '2024-08-26 03:20:55', '2024-08-26 03:20:55', 0, NULL, NULL),
('e24a3947-93da-4b5f-894e-42d3122f6778', '404060b6-ae3d-4fe7-9c27-29b91b36b253', '2bcad1a3-0bb3-4141-a180-4acdf6bfb3ff', '2024-07-29 06:13:26', '2024-07-30 13:42:00', 1, NULL, '0968dca1-d770-4762-ab55-cee664225974');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sub_task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `comment` varchar(255) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `sub_task_id`, `project_id`, `activity_id`, `comment`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('0b027144-ac4e-4712-9eb2-e551b39fa6aa', 'be81f69f-7133-448b-abba-4f8a636a4f05', NULL, NULL, 'kj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:34:34', '2024-08-26 03:34:34', 0, NULL, NULL),
('0fb77d4f-c177-4564-bf8f-c3214be49d6b', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'sdfsd', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 07:58:06', '2024-08-20 07:58:06', 0, NULL, NULL),
('1a13162c-6782-4a6d-aeca-0706759a6df9', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jh', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:17:14', '2024-08-26 02:17:14', 0, NULL, NULL),
('1c35d14e-641b-49d6-a2b5-d04b34e70ea6', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'csds', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:01:25', '2024-08-26 03:01:25', 0, NULL, NULL),
('2267a6a9-b4cc-4e38-a023-f734dee3a5e5', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jhj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:49:13', '2024-08-26 02:49:13', 0, NULL, NULL),
('2330797a-ccc1-402f-9c42-76600b9772eb', '63e1c0b4-43de-4cf5-b4ea-bc15d150a006', NULL, NULL, 'testetst', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 13:08:03', '2024-08-26 13:08:03', 0, NULL, NULL),
('26ca2b88-72db-4e6e-ac3b-71c17779e543', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jhj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:48:40', '2024-08-26 02:48:40', 0, NULL, NULL),
('2bd49836-a47c-47bb-be6c-cb99f86e50d4', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'kjk', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:06:24', '2024-08-26 03:06:24', 0, NULL, NULL),
('44d0d1d3-1186-4857-ac87-5f33f668b95d', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'kjk', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:07:06', '2024-08-26 03:07:06', 0, NULL, NULL),
('4c690324-4204-468c-943f-0aebdd4c3e51', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'fgf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:15:17', '2024-08-26 03:15:17', 0, NULL, NULL),
('4cc2c25d-bcdc-4fd1-97d5-06a1d3671b07', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'sdfs', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 07:53:40', '2024-08-20 07:53:40', 0, NULL, NULL),
('4f8533da-4ea2-46be-8fb1-295a8605f225', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'gfg', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 08:17:20', '2024-08-20 08:17:20', 0, NULL, NULL),
('50804c17-704e-45be-b3b4-68385a579a4f', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'km', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:51:07', '2024-08-26 02:51:07', 0, NULL, NULL),
('52313870-0205-460b-9a14-309bec142716', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jh', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:03:27', '2024-08-26 03:03:27', 0, NULL, NULL),
('5b048055-f61b-4c23-85f7-cd3f1145a743', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'sddf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:36:23', '2024-08-26 02:36:23', 0, NULL, NULL),
('5b2c3060-0627-4a2c-90a3-ba73e758c0fa', 'be81f69f-7133-448b-abba-4f8a636a4f05', NULL, NULL, 'test', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:23:57', '2024-08-26 03:23:57', 0, NULL, NULL),
('5c8021da-c5ac-4a70-bbde-62b436275de4', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'hggh', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-21 06:43:57', '2024-08-21 06:43:57', 0, NULL, NULL),
('5ca42cfa-cc5b-4e28-a147-8b8bd7b0fa45', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jh', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:02:36', '2024-08-26 03:02:36', 0, NULL, NULL),
('6115acb3-bee2-48e4-a323-82a08e1223a8', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jhj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:47:44', '2024-08-26 02:47:44', 0, NULL, NULL),
('63d3f62b-43a4-4afe-88ee-f2cdf7236e81', '230c2855-b19e-42d8-9354-5def1f02ddb7', NULL, NULL, 'sdf', 'dcd49164-3e61-40fc-9329-d930b655552d', 'dcd49164-3e61-40fc-9329-d930b655552d', '2024-09-05 07:27:40', '2024-09-05 07:27:40', 0, NULL, NULL),
('6b90cad8-55ed-4c28-afd8-0f669b928941', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'sdfs', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-21 06:51:58', '2024-08-21 06:51:58', 0, NULL, NULL),
('7554dbc0-d0d3-4607-8bba-5d7123ca05dc', '230c2855-b19e-42d8-9354-5def1f02ddb7', NULL, NULL, 'Test', 'dcd49164-3e61-40fc-9329-d930b655552d', 'dcd49164-3e61-40fc-9329-d930b655552d', '2024-09-05 07:25:57', '2024-09-05 07:25:57', 0, NULL, NULL),
('77f3b4d2-3231-4afe-9eb6-d1561a3186b6', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'dfdf', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '2024-09-05 07:29:58', '2024-09-05 07:29:58', 0, NULL, NULL),
('7a41f591-1b37-4412-bee1-7498abf36d69', '63e1c0b4-43de-4cf5-b4ea-bc15d150a006', NULL, NULL, 'dfd', 'dcd49164-3e61-40fc-9329-d930b655552d', 'dcd49164-3e61-40fc-9329-d930b655552d', '2024-09-05 07:31:01', '2024-09-05 07:31:01', 0, NULL, NULL),
('83f0b4fe-636e-4793-9c2f-d223c83dd9e3', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'kj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:52:07', '2024-08-26 02:52:07', 0, NULL, NULL),
('86666de0-da80-4cdb-b074-4fddf07d1205', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'sdfsdf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 07:59:11', '2024-08-20 07:59:11', 0, NULL, NULL),
('93cfbaa7-fdce-4d31-939b-8c0020e0e807', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'Test\n', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', '2024-09-05 07:29:09', '2024-09-05 07:29:09', 0, NULL, NULL),
('955b4a25-0a72-41e5-bd4f-83990155a9ca', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'vdsvfdsfv', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 07:47:31', '2024-08-20 07:47:31', 0, NULL, NULL),
('9cc42731-b833-4a72-8b89-06ddb1145779', 'be81f69f-7133-448b-abba-4f8a636a4f05', NULL, NULL, 'Please Add dss', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 04:12:13', '2024-08-26 04:12:13', 0, NULL, NULL),
('9db997a7-b6af-4d63-a937-854aef6a9287', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jhj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:54:55', '2024-08-26 02:54:55', 0, NULL, NULL),
('a44cc3ed-01ab-4682-bf40-5fe8058c1b34', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'kjk', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:51:43', '2024-08-26 02:51:43', 0, NULL, NULL),
('a980f47b-ad85-46f5-b482-cc78600ae212', '8aa3c1da-56e3-4ff2-8071-7df07ab8d7a8', NULL, NULL, 'ddf', 'dcd49164-3e61-40fc-9329-d930b655552d', 'dcd49164-3e61-40fc-9329-d930b655552d', '2024-09-05 07:30:55', '2024-09-05 07:30:55', 0, NULL, NULL),
('b1699aba-dfbd-482a-a0ae-518214c7a991', 'be81f69f-7133-448b-abba-4f8a636a4f05', NULL, NULL, 'dfd', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:58:44', '2024-08-26 03:58:44', 0, NULL, NULL),
('b18e0333-3c9a-4696-b277-9687659d486a', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'Test', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '2024-09-05 07:29:38', '2024-09-05 07:29:38', 0, NULL, NULL),
('b4ce7641-2845-48ea-b234-faf096027ab3', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'sdfsdf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 07:47:14', '2024-08-20 07:47:14', 0, NULL, NULL),
('cbd54b79-93d8-4fb6-b25c-cdbeb3fe5d3a', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'hjhj\n', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:58:22', '2024-08-26 02:58:22', 0, NULL, NULL),
('cc3cf529-5f2b-473e-87bc-f1180ae8c955', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'fdss', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 13:00:29', '2024-08-26 13:00:29', 0, NULL, NULL),
('cc587604-7923-4d05-8868-6c6af91bcba8', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'sdfsfs', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-21 06:43:34', '2024-08-21 06:43:34', 0, NULL, NULL),
('cc74bca8-cfb2-4a45-bfaa-de99a97c19ae', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'sdf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:05:10', '2024-08-26 03:05:10', 0, NULL, NULL),
('d36315c8-0809-4524-aebb-b13451074a9c', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'jhj', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 02:49:56', '2024-08-26 02:49:56', 0, NULL, NULL),
('d3a2a6e9-5f39-48e1-b301-4bc1e9f8caa1', NULL, NULL, '404060b6-ae3d-4fe7-9c27-29b91b36b253', 'try', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-07-29 06:22:33', '2024-07-29 06:22:33', 0, NULL, NULL),
('daf034dd-46a4-47dd-9a92-b61845beba52', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'dssdf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-20 08:01:10', '2024-08-20 08:01:10', 0, NULL, NULL),
('dc1489b3-5e99-438a-81e7-f5346bec050a', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'sds', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-21 07:19:57', '2024-08-21 07:19:57', 0, NULL, NULL),
('df2f93ba-766d-42e7-9ffe-728f211ba62f', NULL, NULL, '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'dfg', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', '2024-09-05 04:12:05', '2024-09-05 04:12:05', 0, NULL, NULL),
('e775bb9b-33d4-4b8b-9d98-c2e4b145fc1c', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'sdf', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:04:52', '2024-08-26 03:04:52', 0, NULL, NULL),
('ece9caae-60ad-47a3-839e-2c94f5e20563', '2f868089-5957-489c-94f0-9b2deb46ef9a', NULL, NULL, 'dfd', '0968dca1-d770-4762-ab55-cee664225974', '0968dca1-d770-4762-ab55-cee664225974', '2024-08-26 03:16:48', '2024-08-26 03:16:48', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `division_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sector_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `head_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`division_id`, `sector_id`, `name`, `head_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('2ac53ed3-4182-44cf-b1d1-af952cc73f0b', '270da993-966e-46b9-95bb-aca130f98efc', 'test 2 department', NULL, NULL, NULL, '2024-09-05 00:24:23', '2024-09-05 00:24:23', 0, NULL, NULL),
('60080a2c-f6fa-4f29-895c-1a309cec3482', '270da993-966e-46b9-95bb-aca130f98efc', 'test department', NULL, NULL, NULL, '2024-07-30 08:15:05', '2024-07-30 08:15:05', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `document_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `document` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`document_id`, `document_type_id`, `project_id`, `document`, `description`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('16106def-398e-4891-84aa-84bf38112cc2', '5f517578-443c-11ef-8e35-b05cda965850', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '1722344975243Fellowship Application Call.pdf', 'jjj', NULL, NULL, '2024-07-30 13:09:35', '2024-07-31 06:39:59', 0, NULL, NULL),
('32a360d5-d0eb-4bf9-b0c1-2821d28745c7', '5f517578-443c-11ef-8e35-b05cda965850', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', '1725500929106pdf-test.pdf', NULL, NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('35f11635-3465-4fe9-b7cb-396c6539ec32', '5f517578-443c-11ef-8e35-b05cda965850', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', '1724051226851pdf-test.pdf', NULL, NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('3b3a6a32-4166-4ccf-b961-e98c6049270c', '5f517578-443c-11ef-8e35-b05cda965850', '33f9c253-0060-4abb-b77c-61f92d59209d', '1725501344555pdf-test.pdf', NULL, NULL, NULL, '2024-09-05 01:55:45', '2024-09-05 01:55:45', 0, NULL, NULL),
('4975ed1f-ac22-49bf-897a-7a185185cd41', '5f517578-443c-11ef-8e35-b05cda965850', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '1722345279887Fellowship Application Call.pdf', NULL, NULL, NULL, '2024-07-30 13:14:40', '2024-07-30 13:14:40', 0, NULL, NULL),
('616ea0fa-8bac-43a8-9549-b80651ef7e72', '5f517578-443c-11ef-8e35-b05cda965850', '1352773f-e38f-4a69-b34c-bf9948007912', '1725501710940pdf-test.pdf', NULL, NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('c408a5f6-3ac2-4e3d-9e3f-83365fc71a8f', '5f517578-443c-11ef-8e35-b05cda965850', '5be0bab4-487f-48ea-8215-6d89c5cb6945', '1722233084115project_management_Version 2 (1).docx', NULL, NULL, NULL, '2024-07-29 06:04:44', '2024-07-29 06:04:44', 0, NULL, NULL),
('da1b300c-a1bc-4096-972e-7dc7410b7e9e', '5f517578-443c-11ef-8e35-b05cda965850', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', '17254978880221666204441574.jpg', NULL, NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('ff81e2b8-b710-429a-83bc-b0094479f347', '5f517578-443c-11ef-8e35-b05cda965850', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', '1724642424131project_quality_management_log_and_project_scope_administration_playbook_slide01.jpg', NULL, NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document_types`
--

CREATE TABLE `document_types` (
  `document_type_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document_types`
--

INSERT INTO `document_types` (`document_type_id`, `document_type`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('0aed6bd8-8f80-4cf6-b892-559b2bfcdf37', 'new', NULL, NULL, '2024-07-31 06:51:43', '2024-07-31 06:51:43', 0, NULL, NULL),
('4d93de58-b4f0-4b4f-a02b-eef6ab6e38da', 'try', NULL, NULL, '2024-07-31 06:51:05', '2024-07-31 06:51:05', 0, NULL, NULL),
('5f517578-443c-11ef-8e35-b05cda965850', 'Project Charter', NULL, NULL, '2024-07-17 14:58:56', '2024-07-17 14:58:56', 0, NULL, NULL),
('65cb540e-bb7c-48b8-91a4-8110f8c952db', 'hih', NULL, NULL, '2024-07-31 07:00:46', '2024-07-31 07:00:46', 0, NULL, NULL),
('7878ee79-9f0e-4f20-9fb0-4abc83b74dd3', 'tryt', NULL, NULL, '2024-07-31 07:05:48', '2024-07-31 07:05:48', 0, NULL, NULL),
('ab951fa3-38e8-4880-9547-50e271973c6a', 'hey', NULL, NULL, '2024-07-31 06:54:09', '2024-07-31 06:54:09', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `major_tasks`
--

CREATE TABLE `major_tasks` (
  `Major_task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `major_task_members`
--

CREATE TABLE `major_task_members` (
  `major_task_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `Major_task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `project_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `major_task_status` varchar(255) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `read` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `message`, `user_id`, `project_id`, `read`, `createdAt`, `updatedAt`) VALUES
('00fe554f-3665-4500-bdcf-3a9a52c20de3', 'You\'ve been assigned a new task: \'ghch\' in activity \'fd\'.', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:44:50', '2024-07-31 05:59:53'),
('02e2e01d-1039-4552-9372-0fb6dee0b5bf', 'A new project named New Project 1234 has been created and you have been assigned as a Project Member.', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '33f9c253-0060-4abb-b77c-61f92d59209d', 1, '2024-09-05 01:55:45', '2024-09-05 02:15:22'),
('06db3c97-d41d-4a20-a255-9dda71298fd8', 'A new sub-task \"sdfsdf\" has been created in task \"sdfs\".', '0968dca1-d770-4762-ab55-cee664225974', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-21 06:51:48', '2024-08-21 06:54:50'),
('10516803-2182-4db7-afe8-e977a6574b71', ' A new comment has been added to the sub-task \"dfds\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 0, '2024-09-05 07:30:55', '2024-09-05 07:30:55'),
('12bb4ba4-cf99-4508-903a-420874468542', 'You\'ve been assigned to a new activity: \'Test Activity\' in \'New Test Project 2\' project.', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:20:55', '2024-08-26 03:22:48'),
('19a0a48d-4ba5-43e4-9074-fdd6dab412f4', 'A new project named PMS has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', 1, '2024-07-30 13:14:40', '2024-08-21 06:50:45'),
('1d61602c-6649-4f47-8135-9b82c032aa74', 'A new sub-task \"New Test\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 12:03:21', '2024-08-26 12:09:18'),
('1fa12c00-9733-4385-9237-7b4990129ae4', 'A new project named HRMS has been created and you have been assigned as a Project Manager.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-29 06:04:44', '2024-08-26 13:21:30'),
('23cdabc8-9946-4ee3-acd0-f9aeb3371e20', 'A new sub-task \"New Test\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 12:03:21', '2024-08-26 12:09:18'),
('268b6caf-2d2b-4535-adeb-896a05b8def5', 'A new sub-task \"ngfcgh\" has been created in task \"ghch\".', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:45:16', '2024-07-31 05:59:53'),
('28ae0a5d-ab3d-4a60-82f4-1a9f48490ff1', 'A new sub-task \"kjkj\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 04:46:37', '2024-08-26 12:09:18'),
('2c464479-8759-407e-9cb1-744ee0314906', 'A new sub-task \"New Test\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 12:03:21', '2024-08-26 12:09:18'),
('2cccb10f-0b88-4997-905b-28c698ae1ef4', 'You\'ve been assigned a new task: \'New Test Task\' in activity \'dfs\'.', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-26 03:17:52', '2024-08-26 03:18:33'),
('2e43af73-7fef-4cc8-8a2a-0ca9b476a27f', 'A new project named New Test Project 2 has been created and you have been assigned as a Project Manager.', '0968dca1-d770-4762-ab55-cee664225974', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:20:25', '2024-08-26 03:24:11'),
('3bf2132d-c27d-4423-ae14-5aad50c263ee', 'A new project named test proj has been created and you have been assigned as a Project Member.', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 1, '2024-07-30 13:09:35', '2024-09-04 12:58:15'),
('412119fa-979b-4a1d-91af-949e713ae73b', ' A new comment has been added to the sub-task \"Test Sub Task\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 1, '2024-08-26 03:34:34', '2024-08-26 04:10:24'),
('49074b7c-e465-4be4-bcc3-1a9ee5e7761d', 'A new project named New Project Test 3 has been created and you have been assigned as a Project Member.', '3e5565d7-0978-4b79-8643-622a9a91bb9f', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', 1, '2024-09-05 01:48:50', '2024-09-05 02:15:22'),
('5618874a-bd20-40ad-9b00-90f7c771a9a9', 'You\'ve been assigned a new task: \'fgh\' in activity \'fd\'.', '41147b56-44a5-439c-9165-9de399ef492e', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:42:37', '2024-08-21 06:50:45'),
('57a68885-ed63-4458-b8ce-e5c271d42c3d', 'A new project named New Project 1234 has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', '33f9c253-0060-4abb-b77c-61f92d59209d', 1, '2024-09-05 01:55:45', '2024-09-05 02:18:37'),
('59e36736-546a-45c3-a48e-4435120f6c5d', 'You\'ve been assigned a new task: \'task test\' in activity \'Test activity\'.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-29 06:22:10', '2024-08-26 13:21:30'),
('5e35288c-ce66-4acc-91ea-7fdd9fb56c8e', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 1, '2024-08-26 03:16:49', '2024-08-26 03:16:53'),
('651d2260-7fd1-4f5b-8961-76cacd46eaa0', 'A new sub-task \"sdfsfs\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 08:23:28', '2024-08-26 12:09:18'),
('6529e2a2-c63b-44b0-91b9-2093dc24be02', ' A new comment has been added to the sub-task \"Test Sub Task\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 1, '2024-08-26 04:12:14', '2024-08-26 04:12:20'),
('6785f04f-c0a2-4aa4-bdf4-b4ffbb7640c5', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 0, '2024-09-05 07:29:09', '2024-09-05 07:29:09'),
('682e46ee-20c1-48cc-8878-833bd3f83128', 'A new project named New Test Project has been created and you have been assigned as a Project Manager.', '0968dca1-d770-4762-ab55-cee664225974', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-19 07:07:07', '2024-08-19 07:39:11'),
('6c47464d-96b8-43e0-899f-99e89419f4d2', 'A new project named New Test Project has been created and you have been assigned as a Project Member.', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-19 07:07:07', '2024-08-21 06:50:45'),
('6e35d0e3-3321-4595-8022-a1f2a2525eb6', 'A new sub-task \"vcxbhb\" has been created in task \"ghch\".', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:45:41', '2024-07-31 05:59:53'),
('70d4c788-2455-46a0-b9bf-4319855b3d15', 'A new sub-task \"subtask edit\" has been created in task \"task test\".', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-29 11:36:07', '2024-08-26 13:21:30'),
('76e7e0fc-4e26-4839-b3ee-c63cd733fa24', 'You\'ve been assigned to a new activity: \'dfs\' in \'New Test Project\' project.', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-20 07:47:07', '2024-08-21 06:50:45'),
('7be110a3-fabf-4e8e-a9cf-bddac2b8e23d', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 1, '2024-08-26 03:07:06', '2024-08-26 03:15:23'),
('7d383e2a-b28e-441f-87dd-4a880cf116c1', 'A new sub-task \"jkj\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 04:21:14', '2024-08-26 12:09:18'),
('7d577ea7-523d-4dee-9784-6bc2668469eb', 'You\'ve been assigned a new task: \'test task\' in activity \'Test Activity\'.', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 13:06:18', '2024-09-05 02:18:38'),
('7e1c0c16-54b5-436b-8803-6052eb3484f4', 'A new project named New Test Project 2 has been created and you have been assigned as a Technical Manager.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:20:25', '2024-08-26 13:21:30'),
('864b9029-1e7d-4af2-9933-fec06577a750', 'A new sub-task \"Test Sub Task\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:22:39', '2024-08-26 03:22:48'),
('8744b3b4-7336-4aa1-bdcb-1bb48a182e74', 'You\'ve been assigned to a new activity: \'Test Activity\' in \'New Test Project 2\' project.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:20:55', '2024-08-26 13:21:30'),
('8c472ff9-7f42-4ca5-b4d5-34429a8bc0ed', 'A new sub-task \"dfdfs\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 08:21:42', '2024-08-26 12:09:18'),
('941ae1a0-084c-4e6c-8ee2-4bc704b9e529', 'A new project named New Project Test 3 has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', 1, '2024-09-05 01:48:50', '2024-09-05 02:18:38'),
('9626f6fe-fed8-48eb-9932-cb6e19167bf2', 'A new project named New Test Project 2 has been created and you have been assigned as a Project Member.', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:20:25', '2024-08-26 03:22:48'),
('9c8a6c82-63d8-49bd-a6d2-b905d36a4896', ' A new comment has been added to the sub-task \"test subtask\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 0, '2024-09-05 07:31:01', '2024-09-05 07:31:01'),
('9e506e13-38f1-4925-8055-1ba433206519', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 1, '2024-08-26 03:15:17', '2024-08-26 03:15:24'),
('a3c38f68-eb1f-40d1-a2c5-bcecf2f4ad17', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 0, '2024-09-05 07:29:39', '2024-09-05 07:29:39'),
('a7da7be7-fce3-4e22-97d6-297ca117cebf', 'A new project named New Project Test 2 has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', 1, '2024-09-05 00:58:09', '2024-09-05 02:18:38'),
('a8dc41d2-769b-4acc-8a75-9a3c4c2d7890', 'A new project named Project Test 111 has been created and you have been assigned as a Project Member.', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '1352773f-e38f-4a69-b34c-bf9948007912', 1, '2024-09-05 02:01:51', '2024-09-05 02:15:22'),
('aede87bc-f869-4651-9def-bec01bc96efc', 'You\'ve been assigned a new task: \'sdf\' in activity \'dfs\'.', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-20 08:01:40', '2024-08-21 06:50:45'),
('afc812b1-f77c-4bd5-89dc-9de62a097076', 'A new sub-task \"sdsdc\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 08:21:54', '2024-08-26 12:09:18'),
('baed2a70-a653-4012-a5f6-a365bcb64a52', 'You\'ve been assigned a new task: \'fsdfs\' in activity \'dfs\'.', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-26 13:01:18', '2024-09-05 02:18:38'),
('bd1f1c10-18bb-4825-90ef-1d1fdaaa9722', ' A new comment has been added to the sub-task \"Test Sub Task\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 1, '2024-08-26 03:23:57', '2024-08-26 03:24:48'),
('be0ef681-14fb-49d3-a4d8-6ebc35204887', 'You\'ve been assigned a new task: \'ghch\' in activity \'fd\'.', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:44:50', '2024-07-31 05:59:53'),
('c4c7d14b-64b6-4f07-9554-c9d7c4c2c3a8', 'You\'ve been assigned to a new activity: \'Test activity\' in \'HRMS\' project.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-29 06:05:26', '2024-08-26 13:21:30'),
('d3b20a86-24da-4451-813f-d50a609a53fa', 'You\'ve been assigned a new task: \'ghvg\' in activity \'fd\'.', '41147b56-44a5-439c-9165-9de399ef492e', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:43:00', '2024-08-21 06:50:45'),
('d412293d-164e-42ef-b631-c3f72023631d', 'You\'ve been assigned to a new activity: \'fd\' in \'HRMS\' project.', '41147b56-44a5-439c-9165-9de399ef492e', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:42:25', '2024-08-21 06:50:45'),
('d5d11edf-106b-46c2-ad14-b260dbe34081', ' A new comment has been added to the sub-task \"test subtask\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 1, '2024-08-26 13:08:03', '2024-09-05 02:18:38'),
('d8a8fb65-9314-42da-8e34-f3f6c7516f0d', 'You\'ve been assigned a new task: \'sdfs\' in activity \'dfs\'.', '0968dca1-d770-4762-ab55-cee664225974', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 1, '2024-08-21 06:51:39', '2024-08-21 06:54:51'),
('dfdf6c0a-92f9-4eaf-beb0-e6f3a0277b0c', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 1, '2024-08-26 13:00:29', '2024-08-26 13:00:34'),
('e028f644-7068-43fd-bdd4-a658ef5b1ec5', 'A new project named HRMS has been created and you have been assigned as a Project Member.', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-29 06:04:44', '2024-07-29 14:00:34'),
('e14b85ea-c1d2-4f34-9be6-0c9d92e9cf20', 'You\'ve been assigned a new task: \'New Test Task\' in activity \'Test Activity\'.', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 03:21:41', '2024-08-26 03:22:48'),
('e214c575-d09d-4541-add9-7f1601fe48c2', 'A new project named test proj has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 1, '2024-07-30 13:09:35', '2024-08-21 06:50:45'),
('ea681ece-a9be-4145-8986-6a078a71ec55', ' A new comment has been added to the sub-task \"sdfsdf\".', '0968dca1-d770-4762-ab55-cee664225974', NULL, 0, '2024-09-05 07:29:59', '2024-09-05 07:29:59'),
('ec2f8a90-1050-4e72-a1a0-d6e67e5af4b9', 'A new sub-task \"dfds\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 08:22:33', '2024-08-26 12:09:18'),
('ed920062-faca-454c-8e48-a5adae8d4798', 'A new project named PMS has been created and you have been assigned as a Project Member.', '0968dca1-d770-4762-ab55-cee664225974', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', 1, '2024-07-30 13:14:40', '2024-07-31 05:59:53'),
('edfac671-8f05-44ff-9d2a-64ee69def9bd', 'A new sub-task \"ghj\" has been created in task \"fgh\".', '41147b56-44a5-439c-9165-9de399ef492e', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-08-26 02:07:25', '2024-08-26 02:10:11'),
('ee8b21b5-9e3c-44ab-b469-f4a9cf3eb3e2', 'You\'ve been assigned a new task: \'ghch\' in activity \'fd\'.', '0968dca1-d770-4762-ab55-cee664225974', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 1, '2024-07-30 13:44:50', '2024-07-31 05:59:53'),
('f21a94af-73eb-48cb-928f-dc633922a15c', 'A new sub-task \"test subtask\" has been created in task \"New Test Task\".', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 1, '2024-08-26 13:07:08', '2024-09-05 02:18:38'),
('f67ac314-33d0-4445-b980-e54342f7ad63', 'A new project named New Project Test 2 has been created and you have been assigned as a Project Member.', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', 0, '2024-09-05 00:58:09', '2024-09-05 00:58:09'),
('fb59beea-6503-4c96-a6ed-24fac963762a', 'A new project named Project Test 111 has been created and you have been assigned as a Project Manager.', '41147b56-44a5-439c-9165-9de399ef492e', '1352773f-e38f-4a69-b34c-bf9948007912', 1, '2024-09-05 02:01:52', '2024-09-05 02:18:38'),
('fd849106-8f59-4c28-b803-20ddeeaa11da', ' A new comment has been added to the sub-task \"Test Sub Task\".', '41147b56-44a5-439c-9165-9de399ef492e', NULL, 1, '2024-08-26 03:58:44', '2024-08-26 04:10:25'),
('ff7bb07c-023a-4d89-a517-bae519f530bc', 'A new project named test proj has been created and you have been assigned as a Technical Manager.', '0968dca1-d770-4762-ab55-cee664225974', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 1, '2024-07-30 13:09:35', '2024-07-31 05:59:53');

-- --------------------------------------------------------

--
-- Table structure for table `organizationmedias`
--

CREATE TABLE `organizationmedias` (
  `organization_media_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `organization_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `media_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `organization_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `acronym` varchar(255) DEFAULT NULL,
  `background` varchar(255) DEFAULT NULL,
  `header_color` varchar(255) DEFAULT NULL,
  `footer_color` varchar(255) DEFAULT NULL,
  `background_color` varchar(255) DEFAULT NULL,
  `copyright_text` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`organization_id`, `name`, `logo`, `acronym`, `background`, `header_color`, `footer_color`, `background_color`, `copyright_text`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('40e3eb4e-db30-48fb-936a-1e012a383d30', 'EAII', '17222562252141721647111059ai-generated-7792597.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-29 12:30:25', '2024-07-29 12:30:25', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `group_code` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `name`, `createdAt`, `updatedAt`, `group_code`) VALUES
('042b3d2d-f0bd-11ee-a446-c01803d475fd', 'get teams', '2024-04-02 08:48:22', '2024-04-02 08:48:22', 7),
('0f94a3e8-0da4-11ef-84b6-b48c9dac3d22', 'update user', '2024-05-09 03:30:20', '2024-05-09 03:30:20', 2),
('0f94acc0-0da4-11ef-84b6-b48c9dac3d22', 'delete user', '2024-05-09 03:30:20', '2024-05-09 03:30:20', 2),
('20912e6d-1f53-11ef-be51-b05cda965850', 'get trash', '2024-05-31 15:38:41', '2024-05-31 15:38:41', 9),
('25b8c824-1c5a-11ef-bb5b-b05cda965850', 'view project members', '2024-05-27 20:51:29', '2024-05-27 20:51:29', 3),
('2630baf6-6b2c-11ef-aa12-b05cda965850', 'view users', '2024-09-05 04:11:13', '2024-09-05 04:11:13', 2),
('2f33cdc1-f009-11ee-bd81-c01803d475fd', 'change password', '2024-04-01 11:20:40', '2024-04-01 11:20:40', 2),
('306a3e55-2241-11ef-a40a-c01803d49f59', 'get milestone', '2024-06-04 09:07:48', '2024-06-04 09:07:48', 10),
('355eef05-f0b9-11ee-a446-c01803d475fd', 'create organization', '2024-04-02 08:20:48', '2024-04-02 08:20:48', 1),
('355ef6c3-f0b9-11ee-a446-c01803d475fd', 'update organization', '2024-04-02 08:20:48', '2024-04-02 08:20:48', 1),
('37959d81-1355-11ef-bcd0-b05cda965850', 'view sector', '2024-05-16 09:22:23', '2024-05-16 09:22:23', 1),
('3c9491b1-36d1-11ef-a7a0-c01803d49f59', 'comment on sub task', '2024-06-30 13:09:20', '2024-06-30 13:09:20', 6),
('414c220c-f009-11ee-bd81-c01803d475fd', 'delete organization unit', '2024-04-01 11:21:19', '2024-04-01 11:21:19', 1),
('414c2ab4-f009-11ee-bd81-c01803d475fd', 'delete organization', '2024-04-01 11:21:19', '2024-04-01 11:21:19', 1),
('4673c802-1e4e-11ef-be51-b05cda965850', 'get profile', '2024-05-30 08:31:18', '2024-05-30 08:31:18', 2),
('4673d532-1e4e-11ef-be51-b05cda965850', 'view password', '2024-05-30 08:31:18', '2024-05-30 08:31:18', 2),
('55094e25-0df5-11ef-9350-b48c9dac3d22', 'create task', '2024-05-09 13:14:03', '2024-05-09 13:14:03', 5),
('550954bf-0df5-11ef-9350-b48c9dac3d22', 'update task', '2024-05-09 13:14:03', '2024-05-09 13:14:03', 5),
('555b9d74-f0b9-11ee-a446-c01803d475fd', 'create organization unit', '2024-04-02 08:21:29', '2024-04-02 08:21:29', 1),
('555ba555-f0b9-11ee-a446-c01803d475fd', 'update organization unit', '2024-04-02 08:21:29', '2024-04-02 08:21:29', 1),
('5e67218a-2a31-11ef-b41f-c01803d49f59', 'get structure2', '2024-06-14 11:34:27', '2024-06-14 11:34:27', 11),
('6031481e-1e4d-11ef-be51-b05cda965850', 'get structure', '2024-05-30 08:25:04', '2024-05-30 08:25:04', 1),
('62a21d4f-0df5-11ef-9350-b48c9dac3d22', 'get task', '2024-05-09 13:14:44', '2024-05-09 13:14:44', 5),
('62a22447-0df5-11ef-9350-b48c9dac3d22', 'get all task', '2024-05-09 13:14:44', '2024-05-09 13:14:44', 5),
('64383a86-36d1-11ef-a7a0-c01803d49f59', 'view comment on sub task', '2024-06-30 13:09:44', '2024-06-30 13:09:44', 6),
('6fe619f9-1e4d-11ef-be51-b05cda965850', 'get organization', '2024-05-30 08:25:33', '2024-05-30 08:25:33', 1),
('74118ed8-36c3-11ef-a7a0-c01803d49f59', 'view comment on activity', '2024-06-30 11:30:49', '2024-06-30 11:30:49', 4),
('799466dd-0df4-11ef-9350-b48c9dac3d22', 'create activity', '2024-05-09 13:08:00', '2024-05-09 13:08:00', 4),
('79946ef6-0df4-11ef-9350-b48c9dac3d22', 'update activity', '2024-05-09 13:08:00', '2024-05-09 13:08:00', 4),
('7cacae67-f0b9-11ee-a446-c01803d475fd', 'change user status', '2024-04-02 08:22:49', '2024-04-02 08:22:49', 2),
('7cacb6b1-f0b9-11ee-a446-c01803d475fd', 'create team', '2024-04-02 08:22:49', '2024-04-02 08:22:49', 7),
('85e8ca24-0df3-11ef-9350-b48c9dac3d22', 'get all project', '2024-05-09 13:01:02', '2024-05-09 13:01:02', 3),
('85e8d424-0df3-11ef-9350-b48c9dac3d22', 'get specific project', '2024-05-09 13:01:02', '2024-05-09 13:01:02', 3),
('86ae5a26-f0b9-11ee-a446-c01803d475fd', 'update team', '2024-04-02 08:23:17', '2024-04-02 08:23:17', 7),
('86ae647e-f0b9-11ee-a446-c01803d475fd', 'delete team', '2024-04-02 08:23:17', '2024-04-02 08:23:17', 7),
('8bc30fe2-fdab-11ee-889c-c01803d475fd', 'Delete project', '2024-04-18 19:45:28', '2024-04-18 19:45:28', 3),
('8bc31df5-fdab-11ee-889c-c01803d475fd', 'delete activity', '2024-04-18 19:45:28', '2024-04-18 19:45:28', 4),
('921e960f-1e4e-11ef-be51-b05cda965850', 'view project members profile', '2024-05-30 08:33:28', '2024-05-30 08:33:28', 3),
('9907dce2-0da5-11ef-84b6-b48c9dac3d22', 'get all user', '2024-05-09 03:42:51', '2024-05-09 03:42:51', 2),
('9907e4ed-0da5-11ef-84b6-b48c9dac3d22', 'get specific user', '2024-05-09 03:42:51', '2024-05-09 03:42:51', 2),
('9f3a1a3e-440b-11ef-8e35-b05cda965850', 'view document', '2024-07-17 09:09:45', '2024-07-17 09:09:45', 12),
('9f3a3abc-440b-11ef-8e35-b05cda965850', 'edit document', '2024-07-17 09:09:45', '2024-07-17 09:09:45', 12),
('a5488f51-1c56-11ef-bb5b-b05cda965850', 'get all role', '2024-05-27 20:26:26', '2024-05-27 20:26:26', 2),
('ae7ba5bb-440b-11ef-8e35-b05cda965850', 'download document', '2024-07-17 09:10:12', '2024-07-17 09:10:12', 12),
('ae7bc265-440b-11ef-8e35-b05cda965850', 'delete document', '2024-07-17 09:10:12', '2024-07-17 09:10:12', 12),
('b4315a39-36c3-11ef-a7a0-c01803d49f59', 'comment on activity', '2024-06-30 11:32:36', '2024-06-30 11:32:36', 4),
('b5d82643-0df4-11ef-9350-b48c9dac3d22', 'get all activity', '2024-05-09 13:09:37', '2024-05-09 13:09:37', 4),
('b5d82d4a-0df4-11ef-9350-b48c9dac3d22', 'get activity', '2024-05-09 13:09:37', '2024-05-09 13:09:37', 4),
('be30828d-3388-11ef-813a-b05cda965850', 'add project to department', '2024-06-26 08:52:55', '2024-06-26 08:52:55', 11),
('c2064335-0df7-11ef-9350-b48c9dac3d22', 'get all teams', '2024-05-09 13:31:49', '2024-05-09 13:31:49', 7),
('c3751b5f-0df6-11ef-9350-b48c9dac3d22', 'update sub task', '2024-05-09 13:24:36', '2024-05-09 13:24:36', 6),
('c5c6eeb6-fdab-11ee-889c-c01803d475fd', 'Delete Major task', '2024-04-18 19:47:03', '2024-04-18 19:47:03', 4),
('c5c6f7ad-fdab-11ee-889c-c01803d475fe', 'delete task', '2024-04-18 19:47:03', '2024-04-18 19:47:03', 5),
('d03a82c9-f775-11ee-baf0-c01803d4a116', 'register new user', '2024-04-01 11:20:40', '2024-04-01 11:20:40', 2),
('d1bdedf8-1c57-11ef-bb5b-b05cda965850', 'get home', '2024-05-27 20:34:52', '2024-05-27 20:34:52', 8),
('d975de92-1c57-11ef-bb5b-b05cda965850', 'get admin dashboard', '2024-05-27 20:35:05', '2024-05-27 20:35:05', 8),
('dce2f829-0df5-11ef-9350-b48c9dac3d22', 'get sub task', '2024-05-09 13:18:02', '2024-05-09 13:18:02', 6),
('dce2fde1-0df5-11ef-9350-b48c9dac3d22', 'get all sub task', '2024-05-09 13:18:02', '2024-05-09 13:18:02', 6),
('dd00ad1b-fdab-11ee-889c-c01803d475fd', 'delete sub task', '2024-04-18 19:47:55', '2024-04-18 19:47:55', 6),
('dd00b44f-fdab-11ee-889c-c01803d475fg', 'create sub task', '2024-04-18 19:47:55', '2024-04-18 19:47:55', 6),
('e168618d-1c57-11ef-bb5b-b05cda965850', 'get project dashboard', '2024-05-27 20:35:17', '2024-05-27 20:35:17', 8),
('e562ac9a-1e4d-11ef-be51-b05cda965850', 'create sector', '2024-05-30 08:28:26', '2024-05-30 08:28:26', 1),
('e562bfc8-1e4d-11ef-be51-b05cda965850', 'get organization unit', '2024-05-30 08:28:26', '2024-05-30 08:28:26', 1),
('ee4921a4-0df2-11ef-9350-b48c9dac3d22', 'create project', '2024-05-09 12:56:48', '2024-05-09 12:56:48', 3),
('ee4928bc-0df2-11ef-9350-b48c9dac3d22', 'update project', '2024-05-09 12:56:48', '2024-05-09 12:56:48', 3),
('f50a1cc4-1c57-11ef-bb5b-b05cda965850', 'get workspace', '2024-05-27 20:35:50', '2024-05-27 20:35:50', 4),
('f6aa786d-2ed0-11ef-8adb-c01803d49f59', 'Assign member to sector', '2024-06-20 08:47:18', '2024-06-20 08:47:18', 11),
('fd0f6b57-1e4d-11ef-be51-b05cda965850', 'get sector', '2024-05-30 08:29:00', '2024-05-30 08:29:00', 1),
('fd0f7821-1e4d-11ef-be51-b05cda965850', 'update sector', '2024-05-30 08:29:00', '2024-05-30 08:29:00', 1),
('fd0f8432-1e4d-11ef-be51-b05cda965850', 'delete sector', '2024-05-30 08:29:00', '2024-05-30 08:29:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `overall_progress` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `division_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `description` text DEFAULT NULL,
  `budget` text DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `name`, `overall_progress`, `start_date`, `end_date`, `division_id`, `description`, `budget`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('1352773f-e38f-4a69-b34c-bf9948007912', 'Project Test 111', 'On Progress', '2024-09-10 00:00:00', '2024-09-19 00:00:00', '2ac53ed3-4182-44cf-b1d1-af952cc73f0b', NULL, '', NULL, NULL, '2024-09-05 02:01:50', '2024-09-05 08:50:16', 1, '2024-09-05 08:50:16', '0968dca1-d770-4762-ab55-cee664225974'),
('33f9c253-0060-4abb-b77c-61f92d59209d', 'New Project 1234', 'On Progress', '2024-09-04 00:00:00', '2024-09-17 00:00:00', '60080a2c-f6fa-4f29-895c-1a309cec3482', NULL, '', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 08:52:32', 1, '2024-09-05 08:52:32', '0968dca1-d770-4762-ab55-cee664225974'),
('59722a22-7ad5-42df-80c6-77218f6e5e5d', 'test proj', 'On Progress', '2024-07-30 00:00:00', '2024-07-31 00:00:00', '', 'project description', NULL, NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:11:05', 0, NULL, NULL),
('5be0bab4-487f-48ea-8215-6d89c5cb6945', 'HRMS', 'On Progress', '2024-07-29 00:00:00', '2024-08-10 00:00:00', '', 'project description', NULL, NULL, NULL, '2024-07-29 06:04:44', '2024-08-26 02:05:25', 0, NULL, NULL),
('9dec0b8d-e973-41a0-90a3-b70d6fea4134', 'New Test Project', 'On Progress', '2024-08-19 00:00:00', '2024-09-07 00:00:00', '60080a2c-f6fa-4f29-895c-1a309cec3482', NULL, '5000000', NULL, NULL, '2024-08-19 07:07:06', '2024-08-19 07:07:06', 0, NULL, NULL),
('b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', 'New Project Test 3', 'On Progress', '2024-09-12 00:00:00', '2024-09-26 00:00:00', 'undefined', NULL, '', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('bfb9a27a-156f-4c2f-a3f1-02e940259b15', 'PMS', 'On Progress', '2024-07-30 00:00:00', '2024-07-31 00:00:00', '', 'project description', NULL, NULL, NULL, '2024-07-30 13:14:39', '2024-08-22 13:11:57', 0, NULL, NULL),
('f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', 'New Project Test 2', 'On Progress', '2024-09-05 00:00:00', '2024-09-18 00:00:00', '2ac53ed3-4182-44cf-b1d1-af952cc73f0b', NULL, '', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 'New Test Project 2', 'On Progress', '2024-08-26 00:00:00', '2024-10-02 00:00:00', '60080a2c-f6fa-4f29-895c-1a309cec3482', NULL, '2500000', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `project_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`project_member_id`, `project_id`, `user_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('00678235-c129-4474-8dc3-0593881e2850', '5be0bab4-487f-48ea-8215-6d89c5cb6945', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-07-30 12:24:54', '2024-07-30 12:24:54', 0, NULL, NULL),
('025db445-4a6d-4e6e-a9f5-e914d67b0391', '1352773f-e38f-4a69-b34c-bf9948007912', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('06d4d69e-facb-44ac-9423-e4d0f924b345', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('0c946a63-1a51-4e9f-9d5e-ebebd43ab8e6', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('27d33a6a-5e82-4317-ab5c-4dfbaefae91c', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', '0968dca1-d770-4762-ab55-cee664225974', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('2a5a696e-cc01-47ed-87ac-ea6e1e9c3820', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('2bcad1a3-0bb3-4141-a180-4acdf6bfb3ff', '5be0bab4-487f-48ea-8215-6d89c5cb6945', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', NULL, NULL, '2024-07-29 06:04:44', '2024-07-29 06:04:44', 0, NULL, NULL),
('2cf490db-9c96-4642-b7af-c2a1df618cec', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', NULL, NULL, '2024-07-30 13:16:43', '2024-07-30 13:16:43', 0, NULL, NULL),
('2fe6f9b2-573b-4fdc-9b7e-073d607bbae8', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('35fe5e69-c075-4c77-9040-20d4e806dbd2', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', NULL, NULL, '2024-07-30 13:15:39', '2024-07-30 13:15:39', 0, NULL, NULL),
('436df7f9-8b59-4b49-9f95-d293d538a76c', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('4bef139b-65ff-48fd-8ddc-ee7826a8e309', '1352773f-e38f-4a69-b34c-bf9948007912', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('5c967969-4037-471b-9c7c-ccf80d700237', '5be0bab4-487f-48ea-8215-6d89c5cb6945', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', NULL, NULL, '2024-07-30 12:23:09', '2024-07-30 12:23:09', 0, NULL, NULL),
('6a36f18c-4ad6-4062-a0a8-ab2709c026e7', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('7502af42-0454-4f32-b7e7-aaf687e3f97a', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', '0968dca1-d770-4762-ab55-cee664225974', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL),
('7a432fa6-afa6-4fe7-adee-7d2a2ac8df06', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '0968dca1-d770-4762-ab55-cee664225974', NULL, NULL, '2024-07-30 13:14:40', '2024-07-30 13:14:40', 0, NULL, NULL),
('8175a575-8e48-4265-8fed-68c00fcfb8c1', '33f9c253-0060-4abb-b77c-61f92d59209d', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 01:55:45', '2024-09-05 01:55:45', 0, NULL, NULL),
('8bd464ec-89c9-433c-b542-18d8d839f004', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '0968dca1-d770-4762-ab55-cee664225974', NULL, NULL, '2024-07-30 13:14:40', '2024-07-30 13:14:40', 0, NULL, NULL),
('a193b94f-6eec-4f99-bef9-c32096d3ac6f', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('b2db0929-6ea6-472b-b16f-7ccd56a1d6b4', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('b3f35469-469c-40a6-b923-fda3b0bca090', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-08-22 13:11:57', '2024-08-22 13:11:57', 0, NULL, NULL),
('c0411788-986a-4a8c-8286-d880d2e8438e', '1352773f-e38f-4a69-b34c-bf9948007912', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('ce7d49a4-34fa-47e9-8336-b0412801f19e', '33f9c253-0060-4abb-b77c-61f92d59209d', '3e5565d7-0978-4b79-8643-622a9a91bb9f', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 01:55:44', 0, NULL, NULL),
('cf4c0cd5-3191-431b-86d1-c9acdaff587d', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL),
('db47fb29-d857-46d5-acfc-fc5bdcf764b2', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('e064a50b-8a03-4243-a462-6b4ed160e8e3', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('e16fd311-3fa0-411d-9807-1e1e73f31a0d', '33f9c253-0060-4abb-b77c-61f92d59209d', '41147b56-44a5-439c-9165-9de399ef492e', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 01:55:44', 0, NULL, NULL),
('e210bac1-dc76-468c-8f49-c122e94174c2', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '0968dca1-d770-4762-ab55-cee664225974', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('fdf44d32-36f5-4b85-a0d2-35977ac12060', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `project_related` tinyint(1) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `name`, `project_related`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'Project Member', 1, NULL, NULL, '2024-04-01 08:29:33', '2024-04-01 08:29:33', 0, NULL, NULL),
('4687efcd-5e06-11ef-8e2a-b05cda965850', 'Department Admin', 0, NULL, NULL, '2024-08-19 10:36:52', '2024-08-19 10:36:52', 0, NULL, NULL),
('636f3125-8244-426c-8905-cf8b5045aacd', 'User', 0, NULL, NULL, '2024-04-01 12:42:38', '2024-04-01 12:42:38', 0, NULL, NULL),
('9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'Cluster Admin', 0, NULL, NULL, '2024-09-04 13:19:42', '2024-09-04 13:19:42', 0, NULL, NULL),
('b459daa4-f776-11ee-baf0-c01803d4a116', 'Project Manager', 1, NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('b459e14e-f776-11ee-baf0-c01803d4a116', 'Technical Manager', 1, NULL, NULL, '2024-04-01 08:28:22', '2024-04-01 08:28:22', 0, NULL, NULL),
('c170f434-248d-4e45-a0b0-5101bab7e8e1', 'System Admin', 0, NULL, NULL, '2024-04-01 12:37:24', '2024-06-20 12:57:37', 0, NULL, NULL),
('e09665f2-6aaf-11ef-b1d1-b05cda965850', 'Organization Admin', 0, NULL, NULL, '2024-09-04 13:21:31', '2024-09-04 13:21:31', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `role_permission_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `permission_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`role_permission_id`, `role_id`, `permission_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('002356fc-98a1-40f6-bed6-dc10c6e154d1', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('00f2a5b4-479c-4f62-b642-0ca0c2fd2d9e', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('0126a5b5-8203-41e5-9f72-3fdd5dcf86d6', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '9f3a3abc-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('0192d36e-c25b-4e92-b423-f47f19edf3b3', '4687efcd-5e06-11ef-8e2a-b05cda965850', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('01b9f34d-03b3-4b50-854c-d8c8739616f6', '7055b9e5-5e7d-4e5a-818f-739306b82d4a', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-16 13:21:36', '2024-04-16 13:21:36', 0, NULL, NULL),
('02ba18e9-53c4-430e-a83b-870496fc6547', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'c2064335-0df7-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('02ca6a78-18f4-463a-b966-7c49f58adc7b', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('03cbc17c-4f9b-431a-863b-f769293fe690', 'b459daa4-f776-11ee-baf0-c01803d4a116', '799466dd-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('03d9758a-f6cb-4837-bcb2-294983085637', 'b6d22469-4895-4905-9503-16ca4e2502ab', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-14 07:36:57', '2024-04-14 07:36:57', 0, NULL, NULL),
('045ff4f4-4b7f-40f2-aedd-898a49f1a286', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('04d447f2-0bf1-4916-acf8-fe6120dfcaaa', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '79946ef6-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('05747c9b-cc65-48c1-8726-956840c85d10', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'ae7bc265-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('057f2d72-53b5-49d7-81ac-ec92ba12420e', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:21:45', '2024-09-05 07:21:45', 0, NULL, NULL),
('058c93e8-bbeb-4a40-a670-8a6ef2ea1d44', '4687efcd-5e06-11ef-8e2a-b05cda965850', '550954bf-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('061ba411-a618-4055-8c76-055c38eed7b1', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'ee4928bc-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('06edd1bf-ca13-46f1-9ca2-c8d36f4b0b12', 'd57b5e31-cc33-4d8b-8e0b-2c9c4aa8732e', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:35:20', '2024-04-03 07:35:20', 0, NULL, NULL),
('07383d99-12f3-441c-9dd4-f25980344fec', 'b459daa4-f776-11ee-baf0-c01803d4a116', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('0757cfff-abe9-40f2-8ad8-f21184b3f250', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '2630baf6-6b2c-11ef-aa12-b05cda965850', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('094859b4-9eac-4ffd-8d67-7278ad2f2758', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('09487ceb-18e4-451f-9df0-b7258ded9cde', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'c5c6eeb6-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('09a7dd0f-37e9-41e6-a2f3-02bfedc81a5f', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'b4315a39-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('0a30c362-8faf-4b6e-9131-a87ab703cd32', 'c1b0890d-99ac-4722-9990-5db4fc5cf669', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-14 08:15:36', '2024-04-14 08:15:36', 0, NULL, NULL),
('0a499c74-6ea0-420f-8d37-c5d0963a9353', '24c1e2e7-d7e8-479f-8503-7ced3fa721e0', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:30:45', '2024-04-08 03:30:45', 0, NULL, NULL),
('0a60c3a5-faf9-4cc9-95b9-c8f336c60ca1', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'dd00b44f-fdab-11ee-889c-c01803d475fg', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('0a66ba13-c308-4cc4-871a-cd20bd40c0a8', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '3c9491b1-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('0b7e7670-f0e2-4a3c-852c-90aae3d66a4a', '9acbeb94-bc30-4872-96f1-b5540cb83402', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('0c6831c2-7018-4671-975a-e38da5e87715', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '9907dce2-0da5-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('0cf9a4e8-4c42-4293-a36b-186f925bc726', 'b459daa4-f776-11ee-baf0-c01803d4a116', '306a3e55-2241-11ef-a40a-c01803d49f59', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('0d487225-c557-40a6-b49e-b78ecc79f74c', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('0d4a5196-b388-4daf-ba51-9a56c7eec4aa', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '37959d81-1355-11ef-bcd0-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('0dddd697-a1e9-4af2-a49c-22bb5cef6d23', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'e562bfc8-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('0e51f896-6048-4aaf-8462-f8df6f664eb2', 'f6e69899-dd55-45c9-8e0e-ae1b0653ffb2', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:22:34', '2024-04-03 09:22:34', 0, NULL, NULL),
('100858d5-5782-4223-88fc-18dd183f071c', 'd7f695ea-58b9-4e32-888f-201490402802', 'c5c6eeb6-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('111fb081-7c6c-4a42-9f69-1323310456b4', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:37', '2024-09-05 07:16:37', 0, NULL, NULL),
('1208d500-26ba-4cd6-88ee-b07b94108a14', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('12ae7714-1e4e-40af-a984-284b79aad44f', 'dde498b7-507d-48fc-8e45-051fabfd849e', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:04', '2024-04-08 03:43:04', 0, NULL, NULL),
('13235d26-15d1-4199-a336-424636f0f57a', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('14a401a5-8e76-4a88-9897-57301fddb9ba', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('15493f3e-2478-445a-80c0-fddb9926db5a', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('15bca673-b909-48df-98cd-8ec914dd10a5', '9acbeb94-bc30-4872-96f1-b5540cb83402', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:12', '2024-04-03 08:19:12', 0, NULL, NULL),
('16f32ec8-f8bc-4473-95ba-b89b1664bd2d', '900d3318-e4f9-4871-afe5-6984dc78350e', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:28:30', '2024-04-08 03:28:30', 0, NULL, NULL),
('18924cff-ea69-4778-a3db-a59560565de9', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('19e8fb18-5f3d-4de3-988f-00e1d82c04d1', 'b4820f3e-b0d6-4370-ae2c-52442b993be2', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 10:42:59', '2024-04-03 10:42:59', 0, NULL, NULL),
('1a40bc1c-b0bd-4857-9bbf-915509dd532a', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('1af1045e-a28d-4755-8bfc-eac8fed09c84', '4687efcd-5e06-11ef-8e2a-b05cda965850', '306a3e55-2241-11ef-a40a-c01803d49f59', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('1b2a1828-2247-405d-a654-2ce2e2b4e8e6', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'c3751b5f-0df6-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('1b7c8c22-acdc-4bfd-b13e-72de192a3c65', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('1b899fd9-9171-4e61-a134-9f9bb3211bcb', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('1bb9b988-8cc6-49f0-af9d-569a1aa18022', 'd7f695ea-58b9-4e32-888f-201490402802', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('1d0e6e13-b998-4a71-a4b8-bdf10a729806', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('1d541199-b4a8-41ed-9e05-4b29fae1efac', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('1d7ee39b-6fe4-4131-99f6-a8445cba70d2', 'd7f695ea-58b9-4e32-888f-201490402802', '8bc31df5-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('1dff3326-7c20-4afa-b3a5-6dc147fb488f', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('1e8f9ac6-ddeb-49f1-ac94-24260937000b', '9acbeb94-bc30-4872-96f1-b5540cb83402', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('1e9ff6d6-5110-4607-adba-9b45c4c137eb', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('1fc494b8-b92b-4332-b676-ecb6ebd426ad', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'ae7bc265-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('1fef4e34-1f6f-43ff-9ccc-2f8008eb4f56', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'b4315a39-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('20401292-013f-40a6-9b4f-596c192ea3d5', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '85e8ca24-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('205287c7-01f3-4992-ab64-fffad00f1c32', 'dde498b7-507d-48fc-8e45-051fabfd849e', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:03', '2024-04-08 03:43:03', 0, NULL, NULL),
('214ff333-caeb-4f97-a5d1-baf6abf7bdf9', '42cf3984-740d-4d4f-9138-ad598ee802a6', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 10:45:27', '2024-04-03 10:45:27', 0, NULL, NULL),
('234eb0d4-cf0f-41a3-8033-984190b48eb7', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'c5c6f7ad-fdab-11ee-889c-c01803d475fe', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('240a6402-e8c0-48d7-a0ae-5f3e56fb46e2', '636f3125-8244-426c-8905-cf8b5045aacd', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-01 13:09:50', '2024-07-01 13:09:50', 0, NULL, NULL),
('2526f73b-88b3-4eb7-a594-e850bc6fb48c', '636f3125-8244-426c-8905-cf8b5045aacd', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-01 13:09:51', '2024-07-01 13:09:51', 0, NULL, NULL),
('2546ff7e-9737-4565-8d02-95fb168d8f69', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '9f3a1a3e-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('2642e26e-eb68-4ce8-a2d1-4bd9ea3ad898', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '8bc30fe2-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('26600de6-9eba-4ee4-b292-86c4786623fc', '636f3125-8244-426c-8905-cf8b5045aacd', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-07-01 13:09:51', '2024-07-01 13:09:51', 0, NULL, NULL),
('26b329e3-b114-445d-a939-56183cacb29d', '4687efcd-5e06-11ef-8e2a-b05cda965850', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('282e574b-be41-4e2c-a34a-47a2998f3a51', 'd7f695ea-58b9-4e32-888f-201490402802', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('28811f37-62b7-414c-bcf5-13b2f27ae90f', 'b459daa4-f776-11ee-baf0-c01803d4a116', '550954bf-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('29090b7b-19b3-474f-aae0-41c5b0719642', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('29aed5e3-cd51-41f8-92fc-82ffb1c357d2', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('2a7adb54-ba32-4c55-8833-0fd3080064d1', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:39', '2024-09-05 02:12:39', 0, NULL, NULL),
('2aba256b-063a-4426-9c07-c5d499eafb33', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '3c9491b1-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('2b0dfde6-b465-467d-ac52-f96d3507edd3', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('2b271eea-21fb-40fe-a341-fc1286c5a494', '9acbeb94-bc30-4872-96f1-b5540cb83402', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('2b86035a-d245-4154-abd3-4604f3221446', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'c3751b5f-0df6-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('2be3a4a5-2a0a-45ee-a27a-168102390dab', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'c2064335-0df7-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('2d962ca9-0c77-4389-bfe4-0335c0fca694', '806b3124-f9f5-4fe3-ae28-577a746d72f3', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:25:58', '2024-04-03 09:25:58', 0, NULL, NULL),
('2f273d17-3981-476b-85f7-4e6384a7f76c', '4687efcd-5e06-11ef-8e2a-b05cda965850', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('2f48d698-ba36-4675-a8bb-264174839839', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'd975de92-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('30b32ca3-75ac-48dc-ba01-c04bbe8b1b6a', 'b459daa4-f776-11ee-baf0-c01803d4a116', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('3159df14-7453-4046-bfd5-02e60f96236a', 'c9795f8f-fe90-483e-9731-1e778562fe9a', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 13:35:26', '2024-04-03 13:35:26', 0, NULL, NULL),
('31d24805-cab1-4077-9092-ddf111b468ad', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'd975de92-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('31d7381a-d9b1-42cb-928e-e5f4e98e4712', 'b459daa4-f776-11ee-baf0-c01803d4a116', '8bc31df5-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('330259ea-8a15-495b-9f83-d449137c954a', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('330c6b22-fdc6-4759-b1bd-31c12427b8b3', 'a712d7ee-eebb-496e-ab69-bc450abe0845', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-04 13:19:10', '2024-04-04 13:19:10', 0, NULL, NULL),
('34382b1a-954c-4d1c-8a49-d8fbc0739b98', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 03:39:13', '2024-09-05 03:39:13', 0, NULL, NULL),
('35036d62-407d-41ac-af22-663a8882adba', '900d3318-e4f9-4871-afe5-6984dc78350e', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:28:30', '2024-04-08 03:28:30', 0, NULL, NULL),
('351a669f-2eb2-4d29-94b4-9366e1d1701d', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'e562ac9a-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('375bd038-6648-4f8d-a026-014c0d6c6308', '9acbeb94-bc30-4872-96f1-b5540cb83402', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('37d06dec-4be1-4708-b207-c2c6418a41d1', 'b459daa4-f776-11ee-baf0-c01803d4a116', '3c9491b1-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('38d7b983-8b6f-481e-9736-be68949589cf', 'a7e389b7-01d6-4c17-8b70-213d72e7b371', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-06-20 11:37:54', '2024-06-20 11:37:54', 0, NULL, NULL),
('394ae46d-5499-41d5-b391-b50a1d9e026e', '4687efcd-5e06-11ef-8e2a-b05cda965850', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('3a3fce9d-0d71-49c1-be5c-235410c73d74', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'ae7ba5bb-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('3b3db893-f2a1-4f7e-8416-24a3cb2b9532', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('3c280e92-3172-4aed-9a4f-730c30e59e45', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('3dae8f4b-01b7-408e-8d20-f06b3e291c99', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('3e0fc7aa-f83a-4f8f-b6d3-6fac9c4b4bc5', 'b459e14e-f776-11ee-baf0-c01803d4a116', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('3e397a10-7daa-47ec-8eb6-04f15da3efde', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('3ed7cfa7-727a-46a1-95fc-a30c29b9c005', 'b459e14e-f776-11ee-baf0-c01803d4a116', '550954bf-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('3f04ecc8-fe0a-4b9e-881e-58356f57c8e8', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('3f69a11d-0526-44ad-812a-1180668ca95d', 'dd5cade5-4809-4417-bebe-76c0daff162b', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:27:51', '2024-04-08 03:27:51', 0, NULL, NULL),
('401660df-160f-4b43-b2fd-df98c08f78d8', 'b459e14e-f776-11ee-baf0-c01803d4a116', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('40b29f84-a5f7-43c5-9cae-4704bdf6a70e', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'c2064335-0df7-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('40eb6bb6-8d8a-4e7e-8913-e6c65be3975d', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '306a3e55-2241-11ef-a40a-c01803d49f59', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('41780249-c1e8-44ee-9413-3ff4416dbfba', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('428e098e-af31-4ec9-9a65-850f39d72cec', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '0f94acc0-0da4-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('43592ac0-3487-432c-9dc3-b4afbb73e06a', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('43b35544-3cb0-4f50-8704-9b661f808ccf', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'ae7bc265-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('43bcd8fc-26f0-4a30-9f41-590bb21d602b', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('44963460-ec6b-4f13-99d9-4f770f63e0a5', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('45c5e6fc-2fc2-4f6f-a1d5-f652dc8b905c', 'b459daa4-f776-11ee-baf0-c01803d4a116', '79946ef6-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('460190ce-42b9-41f0-9af3-e00cd8be0892', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('466cac75-17e7-4d19-8313-877af20c9421', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('47ebfc3d-89f5-4bea-93e2-fb8124b7b055', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('49071937-e1d9-4b04-a0a6-e940e168c328', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'ee4928bc-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('4a16a31e-9842-451e-82db-feda94e56512', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('4a1b12ff-3c95-40d8-a4b8-f045be6ccaa9', '4687efcd-5e06-11ef-8e2a-b05cda965850', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('4bc8bbf5-b205-406a-8c0c-4b464a830170', 'bc65f319-75a4-47ee-8016-19415f435efd', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-16 13:26:29', '2024-04-16 13:26:29', 0, NULL, NULL),
('4bcaee0c-6228-42b6-b248-296efb6ab3e7', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'd1bdedf8-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('4ca91d28-4e2d-4862-ace1-df6d14edfb82', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'ae7ba5bb-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('4cb22fdf-fedc-428f-b748-600e12ef4da9', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'f6aa786d-2ed0-11ef-8adb-c01803d49f59', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('4cbd67bd-7eb4-4e74-a99e-552cf9d163af', '4687efcd-5e06-11ef-8e2a-b05cda965850', '55094e25-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('4d6fa99a-ae20-44d1-8331-6e229150341f', 'b459daa4-f776-11ee-baf0-c01803d4a116', '55094e25-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('4d834e72-a91c-4506-8cee-317a7e7282dc', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('4dd6bf74-5aa5-4100-90b8-51aa6cf3678c', 'd7f695ea-58b9-4e32-888f-201490402802', 'c5c6f7ad-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('4e0142ac-145d-4b2d-9df6-bb58642605b8', 'dde498b7-507d-48fc-8e45-051fabfd849e', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:43:04', '2024-04-08 03:43:04', 0, NULL, NULL),
('4e0d4030-3093-4ccc-bd03-9a5a2be86cbf', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'c3751b5f-0df6-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('507ebcfa-46ef-4072-b0ad-a11d1820defd', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('50bdf75f-6a16-4226-8ae2-c834f3008ea7', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('52251bcf-71a8-4fb1-a2a2-c3902dd40ffc', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('52b3df49-0e0a-4c40-acf1-f76ece11cd8f', 'dde498b7-507d-48fc-8e45-051fabfd849e', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:03', '2024-04-08 03:43:03', 0, NULL, NULL),
('5311ce7d-3cb8-4daf-a8f1-5b24a6c60c02', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'd1bdedf8-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('532d4fae-639a-4435-b5bd-0617add8213e', '4687efcd-5e06-11ef-8e2a-b05cda965850', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('53fb195d-884a-4ac3-b625-99e22c134432', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'b5d82d4a-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('543afc94-da42-41c7-b5cf-9a7bd53fca8d', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '5e67218a-2a31-11ef-b41f-c01803d49f59', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('5513b681-41f1-4739-8b03-f8f2835867a0', 'd7f695ea-58b9-4e32-888f-201490402802', 'dd00b44f-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('558a64c7-3979-4ea2-b8a2-ae05b24ae988', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('565fe64d-1fa9-4192-8be4-1484c8434959', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('570dcd85-84f6-4269-bfae-3b6acf6cc6cf', 'c9795f8f-fe90-483e-9731-1e778562fe9a', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 13:35:26', '2024-04-03 13:35:26', 0, NULL, NULL),
('583095ca-a509-4731-936a-754e5cb75f5f', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '9f3a1a3e-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('583c91d0-11f7-454e-af3c-14c112911993', '4687efcd-5e06-11ef-8e2a-b05cda965850', '799466dd-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('58ac6fa0-5241-4b55-b0c6-93fcd5e333ec', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'd975de92-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('5956780d-5f9d-4ed8-83a7-6c03385a3025', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 03:39:11', '2024-09-05 03:39:11', 0, NULL, NULL),
('597c3f36-e973-46d1-a8be-12c1905d4fd0', 'd7f695ea-58b9-4e32-888f-201490402802', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('5afd01e9-c42b-4dcf-9e0f-252be2b33860', '4687efcd-5e06-11ef-8e2a-b05cda965850', '3c9491b1-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('5b7d5093-e389-48d8-9001-73f7dc72c3e5', 'd81e5ec0-050c-43b3-a9ab-164f641f888c', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 10:43:24', '2024-04-03 10:43:24', 0, NULL, NULL),
('5c59a410-9a63-4a3c-944a-74e7f77cf2e5', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '4673c802-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('5c667253-557a-40c2-9bb5-6c60849ac6de', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'c5c6f7ad-fdab-11ee-889c-c01803d475fe', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('5d4e73ae-2e11-4104-b151-c7d0a90ffefd', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-08-22 13:12:51', '2024-08-22 13:12:51', 0, NULL, NULL),
('5e013a80-994a-4176-966e-99af221fa8e5', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-08-22 13:12:51', '2024-08-22 13:12:51', 0, NULL, NULL),
('5ef646b2-67d0-4000-8f9c-0471cb1f2ea9', 'd7f695ea-58b9-4e32-888f-201490402802', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('5f32b37e-2b6f-485c-9a12-0cb360accc3a', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'b4315a39-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('5f861ee8-90fd-4947-82b7-8e3946aec873', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('60851727-8820-4550-ba90-87f14be9f955', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '9f3a1a3e-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 03:39:11', '2024-09-05 03:39:11', 0, NULL, NULL),
('61b5f31a-a40b-44e3-9138-595eca98663f', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'ee4921a4-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('61e02e07-54ee-40bc-804b-11c1ad1dfd90', '4687efcd-5e06-11ef-8e2a-b05cda965850', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('6240297b-e0e5-4411-bceb-b8866d4f4658', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('63132404-55ec-4837-9bee-afd9e7acc29e', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('631a7604-5b04-4a1b-ad5b-4bd3e5a1b475', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '85e8ca24-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('63e0f89a-1198-4c79-b334-197681a21522', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('649a2503-340d-47ab-ae05-d730204c1160', 'ae141d4e-7d8b-4272-9989-78d66ee9f1fb', '0f94a3e8-0da4-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-05-16 11:27:26', '2024-05-16 11:27:26', 0, NULL, NULL),
('64ab0846-49db-4dce-a05a-5457b4081154', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'd1bdedf8-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('64efc109-b6ce-4db3-88cf-a9fa6a56939f', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'c5c6f7ad-fdab-11ee-889c-c01803d475fe', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('64f8bcad-9627-4c47-8004-27880bdbba3f', '9a638616-fb34-4b1f-9c09-6c94e82657ff', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:53:28', '2024-04-03 08:53:28', 0, NULL, NULL),
('655683e7-7318-44ec-9cf7-9306aa5e869e', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('66a27901-1dd1-4cd2-b78b-512f0edc069c', '636f3125-8244-426c-8905-cf8b5045aacd', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-01 13:09:52', '2024-07-01 13:09:52', 0, NULL, NULL),
('67958762-90bf-4f99-9783-e36a1dba939e', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '550954bf-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('67b3d042-9c65-44de-89f0-c7bba7ea0eb7', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('683c3ed3-6228-4ddc-a3fe-61f7c2736808', '3e897d67-4ae8-4c87-81f0-4d8698ae41f5', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:25:53', '2024-04-08 03:25:53', 0, NULL, NULL),
('68d39520-e975-44d7-9ad8-ee60625892ec', '0751ec67-a1a1-4cf0-ad0f-f8feead82e42', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 07:21:00', '2024-06-21 11:20:08', 1, '2024-06-21 11:20:07', '0968dca1-d770-4762-ab55-cee664225974'),
('68f12380-4e98-418d-9356-e914dc0ebbb5', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'b5d82d4a-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('69c8b9fa-51ab-4e0b-ba1d-6e40728108f5', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'dd00b44f-fdab-11ee-889c-c01803d475fg', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('6a8f5ce1-c49a-4c69-ab80-276c0afbc5c6', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '4673c802-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('6b2fb72c-5f49-4d9f-8f10-aa1496dfd1a3', '6e74a62a-ecd1-4025-97ce-c189232586b3', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:35:57', '2024-04-08 03:35:57', 0, NULL, NULL),
('6b31cb25-b95f-4f98-ba0e-94c8eb51e195', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '306a3e55-2241-11ef-a40a-c01803d49f59', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('6c55a865-78be-45bd-ac87-bb4101b55ba8', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('6cad6bd6-484b-400c-8a67-06038c8c47de', 'd7f695ea-58b9-4e32-888f-201490402802', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('6cd56577-3a48-4541-942e-3c9bb856e10a', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'be30828d-3388-11ef-813a-b05cda965850', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('6ceb55d6-b198-4af0-90ee-e616df23e4e8', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', 'c5c6eeb6-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('6e0f5a2a-e32a-4b51-8a16-a242714f7665', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '55094e25-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('6fbe9822-cbba-475d-b9da-7d203010ed41', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '37959d81-1355-11ef-bcd0-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('7002fecf-3e79-4e3a-a54d-ba9b55e972fc', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('7005f5d2-ae23-4c66-a032-f96fffe772e3', 'b459daa4-f776-11ee-baf0-c01803d4a116', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('708cbea1-250d-4518-b202-6e22c635a113', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('70bd976e-4618-408a-9aeb-12b9d9856b2d', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '6031481e-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('72e70489-f46f-42aa-80ef-a151d657dfb2', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'c5c6eeb6-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('73ab4525-8124-4204-9b74-9564bf0ac8fe', '4687efcd-5e06-11ef-8e2a-b05cda965850', '9f3a1a3e-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('75636c93-ab1f-4dd6-a8d2-8b71639ea478', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('75bf6cec-ee98-42c5-bc28-6dc30c611c4e', '24c1e2e7-d7e8-479f-8503-7ced3fa721e0', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:30:45', '2024-04-08 03:30:45', 0, NULL, NULL),
('75d176c1-1c38-424a-bae5-491f9557cf9d', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('77079216-9c0d-4310-afdc-af73211ff346', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'fd0f8432-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('77a406d6-fe5e-4432-9487-95085423f133', 'b459e14e-f776-11ee-baf0-c01803d4a116', '55094e25-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('792c5379-0352-4779-a483-ea51dd35d9e7', 'b459daa4-f776-11ee-baf0-c01803d4a116', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('7a3d4f67-7614-4cde-a975-5c7b4a586000', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('7a680ec2-8108-4781-89e8-882449ed6ee7', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('7b700d6d-38f9-4290-924f-77de42ea123f', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'c2064335-0df7-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('7cbf226b-0065-4a2b-9354-0eef6a6a87ae', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('7d1ceff6-cf79-410b-89ed-bdb5b8c40557', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '6fe619f9-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('7d27a8ec-1494-416a-bd9a-9f9a600a0b37', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('7d3df18b-8f88-4571-85ed-4de391497365', '636f3125-8244-426c-8905-cf8b5045aacd', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-01 13:09:52', '2024-07-01 13:09:52', 0, NULL, NULL),
('7d6f93cd-b9ef-4d29-b7dc-ef1fac08d01c', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:51', '2024-08-22 13:12:51', 0, NULL, NULL),
('7d71e3d4-2215-4447-9da2-129305449aa9', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('7d7dbf0c-4691-4e75-845a-5dfba47d63c8', 'ae141d4e-7d8b-4272-9989-78d66ee9f1fb', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-05-16 11:27:26', '2024-05-16 11:27:26', 0, NULL, NULL),
('7dbdd929-f2d6-4c34-97ef-aac439f7ffe3', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '3c9491b1-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('7e8f5c56-3ac2-4afd-a3c7-ecc721a3ac33', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('7ee687bc-6587-4eb8-84a7-0fb5cf9b36c7', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('80f9fd5b-a6f0-4595-ac13-e65265e9346a', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('81d328f8-55b0-47a4-8a5b-f4daf9ba8a95', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('81d8a0ac-da25-408d-aea3-19d5b3159190', 'd7f695ea-58b9-4e32-888f-201490402802', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('82276427-278d-4c63-bb8c-023d2147953e', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('823afa9c-3395-462f-8b4b-3a2c6d453289', 'f07fd946-1dce-490e-aacb-f862d5425d07', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:13:38', '2024-04-03 09:13:38', 0, NULL, NULL),
('82fd7f43-b7dd-4434-9abc-7ba4453473d2', '99eee55b-5681-4c3e-bd40-c4eb4af2ba2a', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:42:47', '2024-04-03 08:42:47', 0, NULL, NULL),
('8338efd8-cad2-4221-8ff9-cedc4f5b8f7c', '9acbeb94-bc30-4872-96f1-b5540cb83402', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('8353cc05-ca0a-41fd-9353-5de3b16e7609', '4687efcd-5e06-11ef-8e2a-b05cda965850', '8bc31df5-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('835cf39a-730e-42d6-8a21-2f22961fefdb', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'b5d82d4a-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('840c1a22-5299-4c2c-a7e3-b8956d9fe235', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'b4315a39-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('841e3bc5-272b-4e8f-b828-838d4c72ce35', 'c9795f8f-fe90-483e-9731-1e778562fe9a', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 13:35:27', '2024-04-03 13:35:27', 0, NULL, NULL),
('8547dfbe-aed1-4890-bd95-6ad323726ac4', '4687efcd-5e06-11ef-8e2a-b05cda965850', '9f3a3abc-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('85cd6617-ddf8-48d1-aa48-592fd3a734b3', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('874a79c8-1a6d-46da-ab80-04d3ed45cd42', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('8845dfb2-9b3f-4827-bddf-c5997e17c7ec', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('8868acf7-7b51-4d5f-bdeb-3851b534ee59', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('89d80beb-516d-412f-9ab3-a40bfc94d692', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('89d9384d-6894-456b-a142-ecc299cc6731', 'f90e743d-6a81-440d-8039-5354e4262f8f', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:49:46', '2024-04-03 08:49:46', 0, NULL, NULL),
('8a79e73d-78d7-439b-b343-740ab5ceede6', '3e897d67-4ae8-4c87-81f0-4d8698ae41f5', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:25:53', '2024-04-08 03:25:53', 0, NULL, NULL),
('8bfe7302-f441-42d7-a212-2a7a7bde5a3c', '7751f2b0-05a8-4cf4-8407-0ac1e3a969af', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:51:32', '2024-04-03 08:51:32', 0, NULL, NULL),
('8dfbe85b-4de5-4aa0-a78e-1ae12576b455', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'b5d82d4a-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('8e2b0408-02fc-4d19-addc-30ca83f9a9be', 'd7f695ea-58b9-4e32-888f-201490402802', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('922413a0-e50b-42b1-a2df-7f58b22af41f', '636f3125-8244-426c-8905-cf8b5045aacd', '74118ed8-36c3-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-01 13:09:53', '2024-07-01 13:09:53', 0, NULL, NULL),
('924c1706-ea14-4150-9e6b-4b6c93dcf106', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('92ee3191-4c7e-4765-aa2c-656817a32e2d', 'b459daa4-f776-11ee-baf0-c01803d4a116', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('94af987a-283d-4f70-8fa4-67a57e32bfa5', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('95396251-b9df-4391-8253-2eb148e3599a', 'b459daa4-f776-11ee-baf0-c01803d4a116', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('96335ed4-7a6a-4cf5-922e-b11238d02acb', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'ae7ba5bb-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('965b0958-0ebf-49ac-af96-258f7aef6263', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('9786f891-70bb-483e-b53d-84bb66e8f310', 'c1b0890d-99ac-4722-9990-5db4fc5cf669', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-14 08:15:36', '2024-04-14 08:15:36', 0, NULL, NULL),
('98970afa-1773-4cad-b119-d0f0d70f8479', 'bf595b68-63b4-43e8-9df8-26e5d4f33252', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:58:43', '2024-04-03 08:58:43', 0, NULL, NULL),
('99f93c43-87a6-46d3-a646-7e34b682dbb4', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'b5d82d4a-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('9a98f264-af71-4801-a8bd-96785f729586', 'b516e9d3-b618-4d40-aba3-69c8a832f531', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:50:00', '2024-04-03 08:50:00', 0, NULL, NULL),
('9bf3762b-f9c6-48f0-8232-b8af439a31ac', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '20912e6d-1f53-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('9c2800a2-db08-4139-bab0-4329d2cb90e8', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'ee4928bc-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('9c8ae1b8-ee5e-4bb3-9a53-7a3438321d77', 'b459e14e-f776-11ee-baf0-c01803d4a116', '62a21d4f-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('9d0d5000-bf83-42f6-aabd-b5834a252a4c', 'b459daa4-f776-11ee-baf0-c01803d4a116', '9f3a3abc-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('9de40e9f-f73a-4376-87c2-8a81b7a65d7b', 'b459daa4-f776-11ee-baf0-c01803d4a116', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('9df21d1d-6cf6-4ab6-b9f5-4c76b3a5d060', 'b459daa4-f776-11ee-baf0-c01803d4a116', '9f3a1a3e-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('9e062272-6e15-449e-bc96-5c3cedc13fb3', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('9e5b339f-69d9-44b8-a99c-9a2817f36edc', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'a5488f51-1c56-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('9ee917c7-3ca6-4483-9cd1-191bba06055a', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '0f94a3e8-0da4-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('9f6342e7-c123-4c60-b404-aa390fef573e', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '9f3a3abc-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('a1dda983-344c-49ac-b3e0-04d39930cc29', '6ba80e98-5393-4eb1-bfe2-5405be8d6b18', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-16 13:22:30', '2024-04-16 13:22:30', 0, NULL, NULL),
('a23b1ef4-69b9-44aa-b0ab-9a042c5f283b', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('a29f42f2-d072-47aa-a715-012a89da68af', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '37959d81-1355-11ef-bcd0-b05cda965850', NULL, NULL, '2024-09-05 03:39:13', '2024-09-05 03:39:13', 0, NULL, NULL),
('a470d196-34b9-4e6c-aead-4e0c2bb90daf', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL);
INSERT INTO `role_has_permissions` (`role_permission_id`, `role_id`, `permission_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('a4c2bce7-0cc8-4747-b9dc-b2845ae4bfda', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('a564d26b-9981-4a9d-bd81-08a7a10b88f4', '9acbeb94-bc30-4872-96f1-b5540cb83402', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('a57c4d35-2106-444e-8fff-33c5e1f5509f', '9acbeb94-bc30-4872-96f1-b5540cb83402', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('a92da7e5-bdf6-4c87-bbf8-6551a3e3cbeb', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('a9a44771-8e25-46fe-8c62-23f63ad89fab', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'ee4921a4-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('aa93973c-01b5-4394-ac5f-ee4a73ef7dfc', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('aad0bbd0-073e-45e3-9073-fe123971d511', 'ceacd372-d6a2-453e-99a9-1709036f52d9', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-22 17:10:06', '2024-04-22 17:10:06', 0, NULL, NULL),
('ab475b9d-7719-40e4-9857-5f44bd1aa77c', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'd1bdedf8-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('ac63ddb3-8405-4df4-b745-7f6b369e37a3', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'dd00b44f-fdab-11ee-889c-c01803d475fg', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('ac81af8c-397e-4fef-b44a-7246bfc6918c', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '799466dd-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('ad4c0226-3f4d-480c-8d21-c43269e8f635', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('ad8db001-1358-4c1b-ac41-09557c65312e', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('adc1f26c-d3ad-4cbf-bfb9-41b895757161', 'd7f695ea-58b9-4e32-888f-201490402802', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('ae6be8ca-b505-44aa-b146-c280fda76306', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('ae710b2e-4cb4-46c3-b8e8-8e89372716b0', '508dd36f-c85d-442e-b66e-17a58dea2274', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:00:54', '2024-04-03 09:00:54', 0, NULL, NULL),
('af38cb0b-9f03-40cc-b0ce-67d9dde8d638', 'b459daa4-f776-11ee-baf0-c01803d4a116', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('af853f14-9cf9-4727-be14-4a194851b008', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '9907e4ed-0da5-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('b0970b52-a65e-4c2a-ba01-ad00ff0eb722', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'b5d82643-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('b111068a-85fb-4755-8cc6-de9faf9bc48c', '0c11eb79-7ac8-43b5-82c6-74e920b7a0c3', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:34:55', '2024-04-08 03:34:55', 0, NULL, NULL),
('b297e191-deea-41eb-bf49-74a40d5f71fe', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('b2c307d6-1f6a-426c-8369-f72d6e0db6d8', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('b304406e-2080-48ee-911d-d7f4742b366f', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:51', '2024-08-22 13:12:51', 0, NULL, NULL),
('b4090fca-6384-49ba-8cc6-419c5256b51d', '636f3125-8244-426c-8905-cf8b5045aacd', 'd1bdedf8-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-01 13:09:52', '2024-07-01 13:09:52', 0, NULL, NULL),
('b41e4758-cee4-4e90-858f-b560325d1447', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '4673d532-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('b57445ee-1ca0-4431-bb4e-da4a6621c3bc', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('b5770cd4-e633-4f53-870f-7930ade0bbed', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('b5db8f15-02bc-4184-b52b-56543221a124', 'f90e743d-6a81-440d-8039-5354e4262f8f', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:49:46', '2024-04-03 08:49:46', 0, NULL, NULL),
('b72468a9-b060-4b31-bb0f-ae1683949e65', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', 'c5c6f7ad-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('b7bca34d-72f6-42b0-a4e8-f8db20e7301a', 'd7f695ea-58b9-4e32-888f-201490402802', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('bb7d9da7-f90b-4272-b89e-24d1d9280835', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:43', '2024-09-05 02:12:43', 0, NULL, NULL),
('bd15666c-7cfb-4bdc-a4ad-277a91131ecc', 'a712d7ee-eebb-496e-ab69-bc450abe0845', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-04 13:19:10', '2024-04-04 13:19:10', 0, NULL, NULL),
('bd32b2e5-8a6a-4155-ba23-c7f159f5f03a', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'fd0f6b57-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('bd3798aa-55d3-4c0d-825b-76aa6f713889', '4687efcd-5e06-11ef-8e2a-b05cda965850', '62a21d4f-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('bd9af214-5c56-4011-9031-707e46800183', '20f70065-4eb1-4e31-8ee0-36bcc6b6a13a', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:19:45', '2024-04-03 09:19:45', 0, NULL, NULL),
('bdafd3fa-cec6-4e30-9584-107be3dda6e4', '4687efcd-5e06-11ef-8e2a-b05cda965850', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('bddd757f-6319-4b0a-8baa-ce889b78f46f', '4687efcd-5e06-11ef-8e2a-b05cda965850', '8bc30fe2-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('bdf1c4c0-6412-43b4-b6b5-e490c9753609', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'dce2f829-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('be0c9e49-9ece-4cc4-8a9f-e2325b01f1c5', '4687efcd-5e06-11ef-8e2a-b05cda965850', '4673c802-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('bf2427e1-afe0-4b60-ad69-a1a1b07fed4a', 'c1b0890d-99ac-4722-9990-5db4fc5cf669', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-14 08:15:36', '2024-04-14 08:15:36', 0, NULL, NULL),
('bfda9745-0535-42bb-9242-70acfaeb7af9', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('c0d79e67-452f-4401-91a8-602c5c6cf547', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '62a21d4f-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('c0ffe412-a8d2-4520-8896-48c7f43a6095', 'dd5cade5-4809-4417-bebe-76c0daff162b', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:27:51', '2024-04-08 03:27:51', 0, NULL, NULL),
('c2cdcaf8-908a-4d6a-9d3c-ef47ae4f3e7a', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '85e8ca24-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('c2d3535d-1ff9-4c8b-a305-4bf7c274ba51', 'a3b234f2-5540-408b-b838-0020145a761a', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-16 08:53:14', '2024-04-16 08:53:14', 0, NULL, NULL),
('c32594e2-1d73-4839-9822-ae3708972728', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-06-24 11:01:22', '2024-06-24 11:01:22', 0, NULL, NULL),
('c3399d60-405e-4eb9-b779-2dfbbd6e3d8b', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('c3f7dfc7-e2fa-416a-801d-ab7b6d06d4b7', '4687efcd-5e06-11ef-8e2a-b05cda965850', '37959d81-1355-11ef-bcd0-b05cda965850', NULL, NULL, '2024-09-05 07:16:37', '2024-09-05 07:16:37', 0, NULL, NULL),
('c4d9e498-0326-4abc-a951-14d4d71fe3a7', 'b459daa4-f776-11ee-baf0-c01803d4a116', '62a21d4f-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('c54c4d92-5649-4929-9f7e-bcc4d38b7643', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'ae7ba5bb-440b-11ef-8e35-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('c6d609e3-6dc0-40ee-88cd-40168d4cfcd7', '77b9e901-bd00-4317-855d-24466a4f761b', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:56:32', '2024-04-03 08:56:32', 0, NULL, NULL),
('c7e59808-cadd-4c9e-9cc4-0107e39b7d3f', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '8bc31df5-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('c8b21004-7e0d-4475-8daa-2135cb5a817c', 'd7f695ea-58b9-4e32-888f-201490402802', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('c8b46a42-c5c9-4d65-8911-61d0560fd4ef', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '8bc31df5-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('ca44c9e0-c60b-4a0f-a867-6260e44aee6c', 'dde498b7-507d-48fc-8e45-051fabfd849e', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:04', '2024-04-08 03:43:04', 0, NULL, NULL),
('cc68fcbf-b52f-4da2-8e15-ff03bb90f799', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('cc99e5ce-e53a-4b4a-b1dc-513b549552b2', 'e6fe9df1-80a9-46b2-b58b-71ab703ce176', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-14 07:38:43', '2024-04-14 07:38:43', 0, NULL, NULL),
('cd147497-fd07-4f07-9558-5c26b4a18e48', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-27 12:18:28', '2024-04-27 12:18:28', 0, NULL, NULL),
('cd208620-e805-4593-9aaa-69b2014d7ace', '7055b9e5-5e7d-4e5a-818f-739306b82d4a', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-16 13:21:36', '2024-04-16 13:21:36', 0, NULL, NULL),
('ce1b3ac0-d1f1-4c42-bc43-6dc38de1ca93', 'a712d7ee-eebb-496e-ab69-bc450abe0845', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-04 13:19:10', '2024-04-04 13:19:10', 0, NULL, NULL),
('ced2a5c1-acdd-4cf8-8ab2-bef72a11d1dd', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-08-22 13:12:51', '2024-08-22 13:12:51', 0, NULL, NULL),
('d03a010b-a13b-4496-ae7f-3cc0ddec4eab', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('d0fc25e8-bbd3-4165-9fe5-d0f23795e5a2', '89c3841e-67e3-41da-bc37-9e7da92fac45', '042b3d2d-f0bd-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-14 07:38:00', '2024-04-14 07:38:00', 0, NULL, NULL),
('d1169ad3-32b9-4acb-9112-049185c121fd', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('d21c5edf-2e3a-437d-a514-933882d090d9', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'd975de92-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('d47d5876-3f78-423f-a071-54b8db427bd2', '0751ec67-a1a1-4cf0-ad0f-f8feead82e42', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 07:21:00', '2024-06-21 11:20:08', 1, '2024-06-21 11:20:07', '0968dca1-d770-4762-ab55-cee664225974'),
('d63f2d06-4036-4def-805f-5997420c49bb', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'fd0f7821-1e4d-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('d79866e9-2c00-4498-ac2c-6d8e65a50a84', '636f3125-8244-426c-8905-cf8b5045aacd', '4673c802-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-07-01 13:09:51', '2024-07-01 13:09:51', 0, NULL, NULL),
('d86c245f-6383-4950-97ef-7f8c54c58c66', '636f3125-8244-426c-8905-cf8b5045aacd', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-07-01 13:09:52', '2024-07-01 13:09:52', 0, NULL, NULL),
('d9853873-8053-488a-8573-13ec2dcf2c6f', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'dd00b44f-fdab-11ee-889c-c01803d475fg', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('daefb54e-f17e-4bd5-a7f7-0b2a86f91d06', '4687efcd-5e06-11ef-8e2a-b05cda965850', '79946ef6-0df4-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:35', '2024-09-05 07:16:35', 0, NULL, NULL),
('dbc612db-a7b0-4c5a-844d-cd10a8219b07', '7cf747b6-dfe0-4bdc-adab-558240fd1665', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 09:18:01', '2024-04-03 09:18:01', 0, NULL, NULL),
('dc7dea16-df92-4097-9338-1f59e1f31a07', 'd7f695ea-58b9-4e32-888f-201490402802', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('dcb94a36-53f9-420c-adb1-a157691f4536', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'c5c6f7ad-fdab-11ee-889c-c01803d475fe', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('dcba3d48-9f2e-4032-a801-ccedc5b01f74', 'b4820f3e-b0d6-4370-ae2c-52442b993be2', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 10:42:59', '2024-04-03 10:42:59', 0, NULL, NULL),
('dcc5388d-5e24-4f7e-88d8-6a92682ee9e7', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', 'c3751b5f-0df6-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('dd93651b-c073-49be-94a5-f68ac6f6a98b', 'b459daa4-f776-11ee-baf0-c01803d4a116', '25b8c824-1c5a-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('de1a6412-f7b0-4c7a-a0e6-30ee2d23b543', 'dde498b7-507d-48fc-8e45-051fabfd849e', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:04', '2024-04-08 03:43:04', 0, NULL, NULL),
('df242c29-50ad-42f0-820e-6c57f77eeb49', 'b459e14e-f776-11ee-baf0-c01803d4a116', '4673c802-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-06-24 11:01:21', '2024-06-24 11:01:21', 0, NULL, NULL),
('dfabf716-cced-4553-b3fe-05ae58c788f8', '9acbeb94-bc30-4872-96f1-b5540cb83402', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:19:12', '2024-04-03 08:19:12', 0, NULL, NULL),
('e005a545-4b94-4d4e-9b46-140ebfbee694', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('e01ef147-87f9-49ce-8706-c4a9c60f4376', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '86ae5a26-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('e1554171-9c4c-4149-bc79-6d9b8d33c1be', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', 'dd00b44f-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('e1aa7c3a-5120-484a-9317-895661b9b238', 'ae141d4e-7d8b-4272-9989-78d66ee9f1fb', '0f94acc0-0da4-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-05-16 11:27:26', '2024-05-16 11:27:26', 0, NULL, NULL),
('e21dc470-52d7-4dd7-be6c-ed568cacdcba', '4687efcd-5e06-11ef-8e2a-b05cda965850', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('e2a6d8e2-0551-48dc-bb32-577074ee307f', 'c9795f8f-fe90-483e-9731-1e778562fe9a', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 13:35:26', '2024-04-03 13:35:26', 0, NULL, NULL),
('e3515ef7-833d-4d30-85a5-13b8c7ca10bd', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '921e960f-1e4e-11ef-be51-b05cda965850', NULL, NULL, '2024-09-05 02:12:41', '2024-09-05 02:12:41', 0, NULL, NULL),
('e35ef80c-e418-416a-bba5-aa1bf74d8eea', 'd7f695ea-58b9-4e32-888f-201490402802', '8bc30fe2-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-18 17:54:50', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('e3795ff5-cd47-4ad0-a222-2ee54bb32929', '4322e34d-f2b6-4bce-9673-3f87e42d8dc1', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 07:36:35', '2024-04-03 07:36:35', 0, NULL, NULL),
('e3e7193e-6a2f-450c-a5ae-4db477770249', '4687efcd-5e06-11ef-8e2a-b05cda965850', '85e8ca24-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('e4def932-07ff-4c91-a90a-86d145b76ef8', 'd7f695ea-58b9-4e32-888f-201490402802', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('e52d7ea7-3975-4906-af8d-3c00c3f75546', '636f3125-8244-426c-8905-cf8b5045aacd', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-01 13:09:52', '2024-07-01 13:09:52', 0, NULL, NULL),
('e662a700-a784-4575-8efc-54fbe23a3feb', 'b459e14e-f776-11ee-baf0-c01803d4a116', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-06-24 11:01:21', '2024-06-24 11:01:21', 0, NULL, NULL),
('e6a11738-bd7d-43bb-b692-fd827ab9a027', 'dde498b7-507d-48fc-8e45-051fabfd849e', '2f33c5e4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:43:03', '2024-04-08 03:43:03', 0, NULL, NULL),
('e6e89bf8-86bf-483b-af17-ca1726b6c333', '8348b2fd-b7d1-49d0-a0b3-acc8357238e6', '7cacae67-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:26:35', '2024-04-18 17:26:35', 0, NULL, NULL),
('e70adb77-69e5-4320-928f-c21d658f0d0c', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'dce2fde1-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('ea7ae6fd-bf4e-4cbd-977d-54547546d89d', '9b01ad04-c08b-4534-bc00-5f572d169687', '355eef05-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 07:34:39', '2024-06-21 11:20:13', 1, '2024-06-21 11:20:12', '0968dca1-d770-4762-ab55-cee664225974'),
('eaecd897-8194-4e6d-a0b9-b56f690bd27c', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', '85e8d424-0df3-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('eb191431-638d-4369-86e0-88e677ff54b0', 'b459daa4-f776-11ee-baf0-c01803d4a116', '62a22447-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('ed01c3d7-d8b9-4357-a01e-b318327a384a', '9acbeb94-bc30-4872-96f1-b5540cb83402', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('ee797f2f-c07a-4068-bf27-35d857cd8de9', '84fee8c5-9919-4b7a-88c8-225f1a81efe7', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:41:11', '2024-04-08 03:41:11', 0, NULL, NULL),
('ef075f5c-bd9c-47f2-aada-6fd06f932155', '6ba80e98-5393-4eb1-bfe2-5405be8d6b18', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-16 13:22:30', '2024-04-16 13:22:30', 0, NULL, NULL),
('ef5b26f8-c8a1-4750-a72f-63a51b4386b2', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'd03a82c9-f775-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 02:12:40', '2024-09-05 02:12:40', 0, NULL, NULL),
('f1248781-49cc-4a3d-b89e-05997c6071fd', '4687efcd-5e06-11ef-8e2a-b05cda965850', '9907dce2-0da5-11ef-84b6-b48c9dac3d22', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('f17cd65f-8917-4dc3-be2a-0257f55dc426', '4687efcd-5e06-11ef-8e2a-b05cda965850', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 07:16:36', '2024-09-05 07:16:36', 0, NULL, NULL),
('f1a1c28d-f9ce-4b8a-ac8f-8033b775e413', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', '62a21d4f-0df5-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 03:39:12', '2024-09-05 03:39:12', 0, NULL, NULL),
('f2e62460-eb1f-4692-bb69-cf8c2db2f3d3', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'ee4921a4-0df2-11ef-9350-b48c9dac3d22', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('f3f1c267-1e0c-4421-9614-0fbb2d54ca1c', '4687efcd-5e06-11ef-8e2a-b05cda965850', 'c5c6eeb6-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 07:16:34', '2024-09-05 07:16:34', 0, NULL, NULL),
('f409b85a-06d9-4105-9b5d-de3e53cb0d13', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', 'f50a1cc4-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-09-05 07:21:46', '2024-09-05 07:21:46', 0, NULL, NULL),
('f4ca30f7-b052-4e0d-bd49-77a33a589b7a', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', '64383a86-36d1-11ef-a7a0-c01803d49f59', NULL, NULL, '2024-08-22 13:12:50', '2024-08-22 13:12:50', 0, NULL, NULL),
('f59c6ecb-9cdc-4283-b0c1-485b54ffa160', 'd7f695ea-58b9-4e32-888f-201490402802', '7cacb6b1-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('f6467826-f1e0-48a8-90db-8fd8072ec734', 'e2d885eb-cbba-4686-97c5-e7411989826c', '2f33cdc1-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-08 03:36:27', '2024-04-08 03:36:27', 0, NULL, NULL),
('f6f9179f-a510-468a-b644-8528a81b0910', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 02:12:39', '2024-09-05 02:12:39', 0, NULL, NULL),
('f74342c4-6188-4886-9b14-ec5405c1cd93', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '555b9d74-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('f75559b2-c186-44e7-a1a7-950637550e2f', 'dde498b7-507d-48fc-8e45-051fabfd849e', '86ae647e-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:43:04', '2024-04-08 03:43:04', 0, NULL, NULL),
('f7a78235-d694-4579-b6cc-430d02e7a21c', 'b6d22469-4895-4905-9503-16ca4e2502ab', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-14 07:36:57', '2024-04-14 07:36:57', 0, NULL, NULL),
('f7da9f0b-a6b7-4ece-8f9b-303ce86a8d4d', '9acbeb94-bc30-4872-96f1-b5540cb83402', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 08:19:13', '2024-04-03 08:19:13', 0, NULL, NULL),
('f8404aad-5efa-4958-892e-f7d04006825a', 'c9795f8f-fe90-483e-9731-1e778562fe9a', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-03 13:35:26', '2024-04-03 13:35:26', 0, NULL, NULL),
('f8937b00-97cc-4699-8738-1ebcce95ce35', 'd7f695ea-58b9-4e32-888f-201490402802', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-18 17:54:49', '2024-06-21 11:21:28', 1, '2024-06-21 11:21:28', '0968dca1-d770-4762-ab55-cee664225974'),
('f9629257-e0a2-48ab-bc23-5da32a94aac8', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '414c2ab4-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('f9ed992b-7d52-46fb-a60b-dc108c05d641', 'b459daa4-f776-11ee-baf0-c01803d4a116', 'e168618d-1c57-11ef-bb5b-b05cda965850', NULL, NULL, '2024-07-31 06:10:47', '2024-07-31 06:10:47', 0, NULL, NULL),
('fb4d7090-cc9d-43e5-80ca-3e8dc5f44a64', '3e897d67-4ae8-4c87-81f0-4d8698ae41f5', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-08 03:25:53', '2024-04-08 03:25:53', 0, NULL, NULL),
('fb8f4fe8-f3f5-419a-80e1-46cc85e0e7bb', 'b6d22469-4895-4905-9503-16ca4e2502ab', '355ef6c3-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-04-14 07:36:57', '2024-04-14 07:36:57', 0, NULL, NULL),
('fbc8a10c-7c12-4cda-b166-fb06258d66b0', '891fb4e5-6936-4ca9-8626-1a677bbd2be6', '8bc30fe2-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-04-27 12:18:29', '2024-04-27 12:18:29', 0, NULL, NULL),
('fd762de7-9a96-4a7e-8296-be5303834319', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', '555ba555-f0b9-11ee-a446-c01803d475fd', NULL, NULL, '2024-09-05 02:12:42', '2024-09-05 02:12:42', 0, NULL, NULL),
('fd7969d0-aef0-4364-8ae4-ec7f6d145807', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', 'dd00ad1b-fdab-11ee-889c-c01803d475fd', NULL, NULL, '2024-09-05 03:39:10', '2024-09-05 03:39:10', 0, NULL, NULL),
('fe2426a1-83d8-4c1d-9818-109ae7f41a3f', '42cf3984-740d-4d4f-9138-ad598ee802a6', '414c220c-f009-11ee-bd81-c01803d475fd', NULL, NULL, '2024-04-03 10:45:27', '2024-04-03 10:45:27', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--

CREATE TABLE `sectors` (
  `sector_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `leader_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sectors`
--

INSERT INTO `sectors` (`sector_id`, `leader_id`, `name`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('270da993-966e-46b9-95bb-aca130f98efc', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', 'test cluster', NULL, NULL, '2024-07-30 08:14:37', '2024-09-05 03:34:05', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `socialmedias`
--

CREATE TABLE `socialmedias` (
  `media_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `general_url` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subtask_members`
--

CREATE TABLE `subtask_members` (
  `subtask_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sub_task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `project_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subtask_members`
--

INSERT INTO `subtask_members` (`subtask_member_id`, `sub_task_id`, `project_member_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('10494c3a-3735-4036-80d6-b65afb4308b4', 'c7e3fe58-3514-4ae6-9fb8-9e0a873a6b3b', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 12:03:21', '2024-08-26 12:03:21', 0, NULL, NULL),
('16c8b1eb-ee32-4b4d-975d-75312400580f', '7bf5abe7-e3cc-44cf-939c-84b37132f7d8', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 08:21:42', '2024-08-26 08:37:58', 1, '2024-08-26 08:37:58', '41147b56-44a5-439c-9165-9de399ef492e'),
('1d801383-4cc2-4874-94b2-5a77cb88da91', 'c4d52164-c90f-4bc2-bf16-27e413fef549', '00678235-c129-4474-8dc3-0593881e2850', NULL, NULL, '2024-08-26 02:07:25', '2024-08-26 02:07:25', 0, NULL, NULL),
('315f2a17-39e0-4d72-82fe-d453f30451d4', '63e1c0b4-43de-4cf5-b4ea-bc15d150a006', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 13:07:08', '2024-08-26 13:07:08', 0, NULL, NULL),
('32cc967b-dc3b-4f90-a412-8838119def02', '8aa3c1da-56e3-4ff2-8071-7df07ab8d7a8', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 08:22:33', '2024-08-26 08:22:33', 0, NULL, NULL),
('36e09a8c-be61-4bef-aeed-7657f7a01747', '2f868089-5957-489c-94f0-9b2deb46ef9a', '27d33a6a-5e82-4317-ab5c-4dfbaefae91c', NULL, NULL, '2024-08-21 06:51:48', '2024-08-21 06:51:48', 0, NULL, NULL),
('38fda084-bd17-47f8-96ba-6680927e39c6', 'c7e3fe58-3514-4ae6-9fb8-9e0a873a6b3b', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 12:03:21', '2024-08-26 12:03:21', 0, NULL, NULL),
('3debf750-a669-4354-a88b-7d920f3dd385', 'a5e72697-cbe4-42fa-a643-d2bed4b086ef', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 04:46:37', '2024-08-26 04:46:37', 0, NULL, NULL),
('3eb3f2bf-3cf9-4036-a584-2ab93f277937', '0648bbc4-c2a0-4bce-abe4-9de4c829a94a', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 04:21:14', '2024-08-26 08:37:43', 1, '2024-08-26 08:37:43', '41147b56-44a5-439c-9165-9de399ef492e'),
('4a8dcf93-650e-4241-85b0-2aed61471384', '0b591fa5-d3d0-4a9e-aaef-9f8374e23494', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 08:21:54', '2024-08-26 08:37:52', 1, '2024-08-26 08:37:52', '41147b56-44a5-439c-9165-9de399ef492e'),
('66e00f4b-f1c7-4679-ac75-d8863c191c5b', 'd8bb09db-e40f-420c-8e4b-44e9652ad785', '2bcad1a3-0bb3-4141-a180-4acdf6bfb3ff', NULL, NULL, '2024-07-29 11:36:07', '2024-07-29 11:36:07', 0, NULL, NULL),
('678f8c34-1557-4a0f-9bcc-27b721f2c543', 'be81f69f-7133-448b-abba-4f8a636a4f05', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 03:22:39', '2024-08-26 03:22:39', 0, NULL, NULL),
('d056988d-3ed2-4034-a6df-74d53c753ad7', 'c7e3fe58-3514-4ae6-9fb8-9e0a873a6b3b', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 12:03:21', '2024-08-26 12:03:21', 0, NULL, NULL),
('e9543791-cc06-43af-a6e6-a0207485ae31', 'fa6a408a-46a1-4acf-bdc3-782d63c63c5f', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', NULL, NULL, '2024-08-26 08:23:28', '2024-08-26 08:23:28', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sub_tasks`
--

CREATE TABLE `sub_tasks` (
  `sub_task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `subtask_status` varchar(255) NOT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_milestone` tinyint(1) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_tasks`
--

INSERT INTO `sub_tasks` (`sub_task_id`, `task_id`, `name`, `subtask_status`, `start_date`, `end_date`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`, `is_milestone`, `description`) VALUES
('0648bbc4-c2a0-4bce-abe4-9de4c829a94a', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'jkj', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 04:21:13', '2024-08-26 08:37:42', 1, NULL, '41147b56-44a5-439c-9165-9de399ef492e', 0, NULL),
('0b591fa5-d3d0-4a9e-aaef-9f8374e23494', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'sdsdc', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 08:21:54', '2024-08-26 08:37:52', 1, NULL, '41147b56-44a5-439c-9165-9de399ef492e', 0, NULL),
('230c2855-b19e-42d8-9354-5def1f02ddb7', '0422db22-f1fc-479c-844f-f4cfe3711dce', 'vcxbhb', 'Pending', '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', NULL, NULL, '2024-07-30 13:45:41', '2024-07-30 13:45:41', 0, NULL, NULL, 0, NULL),
('2f868089-5957-489c-94f0-9b2deb46ef9a', '410595d1-fec3-4f48-80d6-1e3296cff16b', 'sdfsdf', 'Pending', '2024-08-19T00:00:00.000Z', '2024-09-07T00:00:00.000Z', NULL, NULL, '2024-08-21 06:51:48', '2024-08-21 06:51:48', 0, NULL, NULL, 0, NULL),
('63e1c0b4-43de-4cf5-b4ea-bc15d150a006', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'test subtask', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 13:07:08', '2024-08-26 13:07:08', 0, NULL, NULL, 0, NULL),
('7bf5abe7-e3cc-44cf-939c-84b37132f7d8', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'dfdfs', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 08:21:42', '2024-08-26 08:37:58', 1, NULL, '41147b56-44a5-439c-9165-9de399ef492e', 0, NULL),
('8aa3c1da-56e3-4ff2-8071-7df07ab8d7a8', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'dfds', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 08:22:32', '2024-08-26 08:22:32', 0, NULL, NULL, 0, NULL),
('a5e72697-cbe4-42fa-a643-d2bed4b086ef', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'kjkj', 'Pending', '2024-08-26T00:00:00.000Z', '2024-08-28T00:00:00.000Z', NULL, NULL, '2024-08-26 04:46:37', '2024-08-26 04:46:37', 0, NULL, NULL, 0, NULL),
('be81f69f-7133-448b-abba-4f8a636a4f05', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'Test Sub Task', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 03:22:39', '2024-08-26 03:22:39', 0, NULL, NULL, 0, NULL),
('c102ad7d-42a0-47d3-86e9-7bad32563820', '0422db22-f1fc-479c-844f-f4cfe3711dce', 'ngfcgh', 'Pending', '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', NULL, NULL, '2024-07-30 13:45:16', '2024-07-30 13:45:16', 0, NULL, NULL, 0, NULL),
('c4d52164-c90f-4bc2-bf16-27e413fef549', '6989df1d-b1bd-47e7-b820-724616bb185f', 'ghj', 'Pending', '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', NULL, NULL, '2024-08-26 02:07:25', '2024-08-26 02:07:25', 0, NULL, NULL, 0, NULL),
('c7e3fe58-3514-4ae6-9fb8-9e0a873a6b3b', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'New Test', 'Pending', '2024-08-26T00:00:00.000Z', '2024-09-07T00:00:00.000Z', NULL, NULL, '2024-08-26 12:03:21', '2024-08-26 12:03:21', 0, NULL, NULL, 0, NULL),
('d8bb09db-e40f-420c-8e4b-44e9652ad785', 'e35bd9c1-6c95-415d-86d8-aaa2ccc9893f', 'subtask edit', 'Pending', '2024-07-29T00:00:00.000Z', '2024-08-07T00:00:00.000Z', NULL, NULL, '2024-07-29 11:36:07', '2024-07-29 11:36:07', 0, NULL, NULL, 1, NULL),
('fa6a408a-46a1-4acf-bdc3-782d63c63c5f', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 'sdfsfs', 'Pending', '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', NULL, NULL, '2024-08-26 08:23:27', '2024-08-26 08:23:27', 0, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `task_status` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `is_milestone` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `activity_id`, `task_status`, `name`, `description`, `start_date`, `end_date`, `is_milestone`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('0422db22-f1fc-479c-844f-f4cfe3711dce', 'f8896a71-752a-471f-a17b-83154cf153cc', 'Pending', 'ghch', NULL, '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', 0, NULL, NULL, '2024-07-30 13:44:50', '2024-07-30 13:44:50', 0, NULL, NULL),
('1c912e6e-55e2-426a-9f97-416342d66092', '84905c6b-5119-4107-98f3-0b077912b565', 'Pending', 'test task', NULL, '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', 0, NULL, NULL, '2024-08-26 13:06:18', '2024-08-26 13:06:18', 0, NULL, NULL),
('22221efc-756a-498a-90a9-e056d2928655', '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'Pending', 'sdf', NULL, '2024-08-19T00:00:00.000Z', '2024-09-07T00:00:00.000Z', 0, NULL, NULL, '2024-08-20 08:01:40', '2024-08-20 08:01:40', 0, NULL, NULL),
('2f4a9f07-5273-45ab-a91c-fef13a166d4a', '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'Pending', 'New Test Task', NULL, '2024-08-19T00:00:00.000Z', '2024-09-07T00:00:00.000Z', 0, NULL, NULL, '2024-08-26 03:17:52', '2024-08-26 03:17:52', 0, NULL, NULL),
('410595d1-fec3-4f48-80d6-1e3296cff16b', '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'Pending', 'sdfs', NULL, '2024-08-19T00:00:00.000Z', '2024-09-07T00:00:00.000Z', 0, NULL, NULL, '2024-08-21 06:51:39', '2024-08-21 06:51:39', 0, NULL, NULL),
('6989df1d-b1bd-47e7-b820-724616bb185f', 'f8896a71-752a-471f-a17b-83154cf153cc', 'Pending', 'fgh', NULL, '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', 0, NULL, NULL, '2024-07-30 13:42:37', '2024-08-20 11:15:56', 0, NULL, NULL),
('acca1af2-f1f8-4b8d-b800-088516cf8369', '84905c6b-5119-4107-98f3-0b077912b565', 'Pending', 'New Test Task', NULL, '2024-08-26T00:00:00.000Z', '2024-10-02T00:00:00.000Z', 0, NULL, NULL, '2024-08-26 03:21:41', '2024-08-26 03:21:41', 0, NULL, NULL),
('b42a1194-315c-4147-b3ae-6c0a3aa2b42e', 'f8896a71-752a-471f-a17b-83154cf153cc', 'Pending', 'ghvg', NULL, '2024-07-29T00:00:00.000Z', '2024-08-10T00:00:00.000Z', 0, NULL, NULL, '2024-07-30 13:43:00', '2024-07-30 13:43:00', 0, NULL, NULL),
('e35bd9c1-6c95-415d-86d8-aaa2ccc9893f', '404060b6-ae3d-4fe7-9c27-29b91b36b253', 'Pending', 'task test', NULL, '2024-07-29T00:00:00.000Z', '2024-08-07T00:00:00.000Z', 1, NULL, NULL, '2024-07-29 06:22:10', '2024-07-29 11:36:07', 0, NULL, NULL),
('f05d3fd9-d30f-450b-8a2d-1ef741cbf933', '7f533747-a50c-4a8e-8a10-4bd27a7f4d5c', 'Pending', 'fsdfs', NULL, '2024-08-19T00:00:00.000Z', '2024-09-07T00:00:00.000Z', 0, NULL, NULL, '2024-08-26 13:01:18', '2024-08-26 13:01:18', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task_members`
--

CREATE TABLE `task_members` (
  `task_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `task_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_members`
--

INSERT INTO `task_members` (`task_member_id`, `project_member_id`, `task_id`, `is_deleted`, `deletionAt`, `deletedBy`, `createdAt`, `updatedAt`) VALUES
('050b0e54-cf0b-4e6c-9961-682e89dd3331', 'db47fb29-d857-46d5-acfc-fc5bdcf764b2', 'f05d3fd9-d30f-450b-8a2d-1ef741cbf933', 0, NULL, NULL, '2024-08-26 13:01:18', '2024-08-26 13:01:18'),
('28ca3cc6-10ab-4dcd-936e-59cdcb287fed', 'a193b94f-6eec-4f99-bef9-c32096d3ac6f', '22221efc-756a-498a-90a9-e056d2928655', 0, NULL, NULL, '2024-08-20 08:01:40', '2024-08-20 08:01:40'),
('2faeec11-a9db-48e9-bd90-0adb9b1d1e5b', '27d33a6a-5e82-4317-ab5c-4dfbaefae91c', '410595d1-fec3-4f48-80d6-1e3296cff16b', 0, NULL, NULL, '2024-08-21 06:51:39', '2024-08-21 06:51:39'),
('43d8cb6b-b8e4-4ded-bdeb-58bee06c3dfa', '00678235-c129-4474-8dc3-0593881e2850', '6989df1d-b1bd-47e7-b820-724616bb185f', 0, NULL, NULL, '2024-07-30 13:42:37', '2024-08-20 11:15:57'),
('752d69ad-4e58-4108-b24e-f4358d3e535c', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', '1c912e6e-55e2-426a-9f97-416342d66092', 0, NULL, NULL, '2024-08-26 13:06:18', '2024-08-26 13:06:18'),
('7ca1d2f2-99a6-42e8-b553-bc816b75a203', '2bcad1a3-0bb3-4141-a180-4acdf6bfb3ff', 'e35bd9c1-6c95-415d-86d8-aaa2ccc9893f', 0, NULL, NULL, '2024-07-29 06:22:10', '2024-07-29 06:22:10'),
('9a2bb8e1-7dff-47da-a5b1-df9b742198d5', '00678235-c129-4474-8dc3-0593881e2850', 'b42a1194-315c-4147-b3ae-6c0a3aa2b42e', 0, NULL, NULL, '2024-07-30 13:43:00', '2024-07-30 13:43:00'),
('d591eb42-e4ad-445d-bade-31412b43d91e', 'cf4c0cd5-3191-431b-86d1-c9acdaff587d', 'acca1af2-f1f8-4b8d-b800-088516cf8369', 0, NULL, NULL, '2024-08-26 03:21:41', '2024-08-26 03:21:41'),
('dde9e90b-7e58-41e7-8d5a-12a9874b291a', 'a193b94f-6eec-4f99-bef9-c32096d3ac6f', '2f4a9f07-5273-45ab-a91c-fef13a166d4a', 0, NULL, NULL, '2024-08-26 03:17:52', '2024-08-26 03:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `team_manager_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `division_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `first_time_status` tinyint(1) NOT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `unchanged_password` varchar(255) DEFAULT NULL,
  `division_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `team_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_division_leader` tinyint(4) NOT NULL DEFAULT 0,
  `project_status` tinyint(1) DEFAULT NULL,
  `account_status` tinyint(1) DEFAULT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `passwordResetHash` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `first_time_status`, `img_url`, `email`, `gender`, `password`, `unchanged_password`, `division_id`, `refreshToken`, `team_id`, `is_division_leader`, `project_status`, `account_status`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`, `passwordResetHash`) VALUES
('0968dca1-d770-4762-ab55-cee664225974', 'Admin', 1, 'image', 'admin@admin.com', 'M', '$2b$06$O6bZ8/4LTaxT6uZHAKurMOrlrDQMaEw.evtnNEEYl0AqjMrCwUyke', '', '098fae6b-9ab3-4232-b929-bb0e0afd2e98', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJBZG1pbiIsImlhdCI6MTcyNTU0MzIxNiwiZXhwIjoxNzI1NjI5NjE2fQ.h109Jp56StjH3CNzMLZaUSJM_vpSpru3kealVXLj9P0', NULL, 0, 0, 1, NULL, NULL, '2024-04-01 09:46:59', '2024-09-05 13:33:36', 0, NULL, NULL, ''),
('3e5565d7-0978-4b79-8643-622a9a91bb9f', 'Test User', 1, NULL, 'test@gmail.com', 'Male', '$2b$06$tUrxMlW7L87oIrK7DoBZGe/HrX7VwgT8cLF5LIoFzyID345MrrBJm', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE3MjU1MDI1MDgsImV4cCI6MTcyNTU4ODkwOH0.W4AW3woLbUS9w_c3woxp5RZxtPsfX3zujptqVK_j588', NULL, 0, 0, 1, NULL, NULL, '2024-09-05 01:00:26', '2024-09-05 02:15:08', 0, NULL, NULL, ''),
('41147b56-44a5-439c-9165-9de399ef492e', 'abdi elias', 1, NULL, 'kkdk@ee.com', 'Male', '$2b$06$M3AbPZ2swY4OStC1CuIQzeopIrx2fhWqjqws2dUhJRzdD7gT82..6', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJhYmRpIGVsaWFzIiwiaWF0IjoxNzI1NTA2MjA0LCJleHAiOjE3MjU1OTI2MDR9.q68jxBrAZJY6iYoAh4p8JbmZG5Ksejt5SoU_-a5MarM', NULL, 0, 0, 1, NULL, NULL, '2024-07-29 07:58:21', '2024-09-05 03:16:44', 0, NULL, NULL, ''),
('4e83790d-ebd7-41c1-95c4-97b9fcfd43a9', 'Test User 2', 1, NULL, 'testuser2@gmail.com', 'Male', '$2b$06$W8Kk5ApZWpYs28.GApW1hOM1zYafjlej.AHcGu53DqYXl/lIdNZp.', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJUZXN0IFVzZXIgMiIsImlhdCI6MTcyNTQ5OTE0NiwiZXhwIjoxNzI1NTg1NTQ2fQ.-zROJjIhHmktlK7SNkLNVs2zs9BXju0EuBJp9IPwEmo', NULL, 0, 0, 1, NULL, NULL, '2024-09-05 01:07:25', '2024-09-05 01:19:06', 0, NULL, NULL, ''),
('707e1956-84d2-40ec-91f5-7c0c2912e4b7', 'alif12323', 1, NULL, 'alif2323@alif.com', 'Male', '$2b$06$ldPVA172UQXnru32Da6kfe7la0Fr9LTkVSYaRmrZsCa9ParkLQxiC', '', '60080a2c-f6fa-4f29-895c-1a309cec3482', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJhbGlmMTIzMjMiLCJpYXQiOjE3MjU1NDI1ODEsImV4cCI6MTcyNTYyODk4MX0.fZVPrOXhXRsJkfzhpc4URfY5Ezy4v5Ej65DkgAVxdvY', NULL, 0, 0, 1, NULL, NULL, '2024-07-29 07:13:19', '2024-09-05 13:23:01', 0, NULL, NULL, ''),
('7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'Robe Getachew ', 1, NULL, 'robegetachew12@gmail.com', 'female', '$2b$06$8gwDjk7J3j78PZylj5t6Lu2lPKLQzZnq/0IWKArWjemuS0DYTXNfG', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJSb2JlIEdldGFjaGV3ICIsImlhdCI6MTcyNDY3ODQ3NywiZXhwIjoxNzI0NzY0ODc3fQ.CFsQVyGAWlcMA2JK9yVw6v32rGnBsTVvx2Vygx1ydJE', NULL, 0, 0, 1, NULL, NULL, '2024-07-29 05:48:04', '2024-08-26 13:21:17', 0, NULL, NULL, 'b242533d7a0dd7ce93ddb3e7388d90ba'),
('86469361-8a9e-4e33-9841-25e4f4dc7e81', 'Henok', 1, NULL, 'henok@gmail.com', 'Male', '$2b$06$bOFRhmXgRGrMziQ70FKQQOq4ate.za0ZnIpJUFXA2U8biggerwft2', '', '2ac53ed3-4182-44cf-b1d1-af952cc73f0b', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJIZW5vayIsImlhdCI6MTcyNTUwNTAyNywiZXhwIjoxNzI1NTkxNDI3fQ.NBr3_zs_fJmQZ-OaWV7dxC9fXfF0Ean6HQSCtItag-Y', NULL, 0, 0, 1, NULL, NULL, '2024-09-05 00:25:19', '2024-09-05 02:57:07', 0, NULL, NULL, ''),
('c30b2af1-5d8d-41b8-801c-0613e937fb14', 'Test User 3', 1, NULL, 'test3@gmail.com', 'Male', '$2b$06$FoULkOAD0k3tFUO0v.90R.I1LND76WH3gYeguM0veYd3d87cQS2Ji', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJUZXN0IFVzZXIgMyIsImlhdCI6MTcyNTUyMTMyNywiZXhwIjoxNzI1NjA3NzI3fQ.GKgqzuJl22w8WsIxlISHhaCJ4LpFV6XGU-5_2KrvE_k', NULL, 0, 0, 1, NULL, NULL, '2024-09-05 02:22:06', '2024-09-05 07:28:47', 0, NULL, NULL, ''),
('dcd49164-3e61-40fc-9329-d930b655552d', 'Test User 4', 1, NULL, 'testuser4@gmail.com', 'Male', '$2b$06$z2WZ85WgYF0paVbGw6I.U.ui15STKMNfg2Dh6NgF8tu5tOxxXcCae', '', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsX25hbWUiOiJUZXN0IFVzZXIgNCIsImlhdCI6MTcyNTUyMTQ0MSwiZXhwIjoxNzI1NjA3ODQxfQ.1ngevgaA-jDEpNOBjAxwp-PiEZSctwZ8r31DGpchPvU', NULL, 0, 0, 1, NULL, NULL, '2024-09-05 07:19:37', '2024-09-05 07:30:41', 0, NULL, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `project_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updated_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `is_deleted` tinyint(1) NOT NULL,
  `deletionAt` datetime DEFAULT NULL,
  `deletedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_role_id`, `user_id`, `project_id`, `role_id`, `created_by`, `updated_by`, `createdAt`, `updatedAt`, `is_deleted`, `deletionAt`, `deletedBy`) VALUES
('0190f08f-5599-4ae7-827d-a8174fe1561e', '0968dca1-d770-4762-ab55-cee664225974', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-07-30 13:10:52', '2024-07-30 13:10:52', 0, NULL, NULL),
('13728c40-763b-4c5f-b702-05c61dfc89e4', '0968dca1-d770-4762-ab55-cee664225974', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('18755cf1-9dee-4ee5-ae96-70b6859aa51f', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '1352773f-e38f-4a69-b34c-bf9948007912', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('19aac46e-7425-49ae-a307-3e0e81be01e6', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-30 13:15:39', '2024-07-30 13:15:39', 0, NULL, NULL),
('1caf6ef5-5fe1-447c-a258-548495113e62', '41147b56-44a5-439c-9165-9de399ef492e', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('2131f6e6-443b-11ef-8e35-b05cda965850', '0968dca1-d770-4762-ab55-cee664225974', '', 'c170f434-248d-4e45-a0b0-5101bab7e8e1', NULL, NULL, '2024-07-17 14:49:01', '2024-07-17 14:49:01', 0, NULL, NULL),
('2191a32c-ab29-4f6a-a4db-4fb96e5218b2', '4e83790d-ebd7-41c1-95c4-97b9fcfd43a9', '97a17f58-f00c-11ee-bd81-c01803d475fd', '4687efcd-5e06-11ef-8e2a-b05cda965850', NULL, NULL, '2024-09-05 01:07:25', '2024-09-05 01:07:25', 0, NULL, NULL),
('30604e35-99dc-4a69-83cb-6f980478c15b', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-29 06:04:44', '2024-07-29 06:04:44', 0, NULL, NULL),
('33fc259b-dc77-4573-a11b-15fe54da3fef', '41147b56-44a5-439c-9165-9de399ef492e', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-08-22 13:11:57', '2024-08-22 13:11:57', 0, NULL, NULL),
('3706f3c0-6eb7-44ed-b705-25944be591d7', '41147b56-44a5-439c-9165-9de399ef492e', '97a17f58-f00c-11ee-bd81-c01803d475fd', '636f3125-8244-426c-8905-cf8b5045aacd', NULL, NULL, '2024-07-29 07:58:21', '2024-07-29 07:58:21', 0, NULL, NULL),
('3d2d0a45-a8fc-4d88-a671-89df21ba6f4d', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', '4687efcd-5e06-11ef-8e2a-b05cda965850', NULL, NULL, '2024-07-30 13:16:43', '2024-09-04 12:55:17', 0, NULL, NULL),
('3e84a4b3-8ce5-4ab7-8b26-83f12494b3ec', '41147b56-44a5-439c-9165-9de399ef492e', '33f9c253-0060-4abb-b77c-61f92d59209d', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 01:55:44', 0, NULL, NULL),
('4866fecd-f257-4954-be97-ca83611729a6', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('48b0b840-60f6-4dbd-a87e-edb8cd4583f2', '0968dca1-d770-4762-ab55-cee664225974', 'bfb9a27a-156f-4c2f-a3f1-02e940259b15', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-30 13:14:39', '2024-07-30 13:14:39', 0, NULL, NULL),
('554f047b-6d73-41c6-b992-7b5a0350a17d', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('5c4ef89d-8d57-4a37-9556-77fb97166fe6', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '97a17f58-f00c-11ee-bd81-c01803d475fd', '636f3125-8244-426c-8905-cf8b5045aacd', NULL, NULL, '2024-09-05 01:00:26', '2024-09-05 01:00:26', 0, NULL, NULL),
('5c815578-b1ed-4244-ae58-df0a9c3aa1ce', '0968dca1-d770-4762-ab55-cee664225974', '59722a22-7ad5-42df-80c6-77218f6e5e5d', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-07-30 13:11:05', '2024-07-30 13:11:05', 0, NULL, NULL),
('65f8505e-3b1d-45e9-8b16-46e5e1c74e90', '41147b56-44a5-439c-9165-9de399ef492e', '1352773f-e38f-4a69-b34c-bf9948007912', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('687dec7b-f280-454b-b2c3-799d7d31dc32', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '5be0bab4-487f-48ea-8215-6d89c5cb6945', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-08-26 02:05:25', '2024-08-26 02:05:25', 0, NULL, NULL),
('6cd81075-d19b-48ba-a8f3-a813373b6bb0', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', '97a17f58-f00c-11ee-bd81-c01803d475fd', '636f3125-8244-426c-8905-cf8b5045aacd', NULL, NULL, '2024-07-29 05:48:04', '2024-07-29 05:48:04', 0, NULL, NULL),
('76ee61f3-8550-4d3e-b7bd-293d31901adf', '7cfa0afe-33be-4e0d-a0df-ace1826a276b', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL),
('77f892c5-8c8b-45fc-ac47-0ccfaa5cb24d', '41147b56-44a5-439c-9165-9de399ef492e', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('7e7d72f6-6057-4bee-b6d2-973f5e9e55ef', 'c30b2af1-5d8d-41b8-801c-0613e937fb14', '97a17f58-f00c-11ee-bd81-c01803d475fd', '9ff7d53d-6aaf-11ef-b1d1-b05cda965850', NULL, NULL, '2024-09-05 02:22:06', '2024-09-05 02:22:06', 0, NULL, NULL),
('8907221a-1e2b-4982-b07c-ecf8b38f78e7', '0968dca1-d770-4762-ab55-cee664225974', '', '1896a95c-06ed-11ef-a47a-c01803d4a116', NULL, NULL, '2024-07-29 12:52:32', '2024-07-29 12:52:32', 0, NULL, NULL),
('9241aa64-e2ac-453b-9638-da92dbadc7e2', '41147b56-44a5-439c-9165-9de399ef492e', 'f0cd99b1-fd91-4a80-bfb6-9348d1c5c4c1', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 00:58:08', '2024-09-05 00:58:08', 0, NULL, NULL),
('9574a56f-25a1-4f29-954d-975c03be6d5a', '41147b56-44a5-439c-9165-9de399ef492e', '5be0bab4-487f-48ea-8215-6d89c5cb6945', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-08-26 02:05:25', '2024-08-26 02:05:25', 0, NULL, NULL),
('95b11eec-9d42-43d6-a219-ac643267ebe0', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('9ab8ab7c-f490-4311-a816-f705f9fc5505', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '1352773f-e38f-4a69-b34c-bf9948007912', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 02:01:51', '2024-09-05 02:01:51', 0, NULL, NULL),
('a8051b6b-c6f7-4f05-a64d-4f56b2053b3c', '86469361-8a9e-4e33-9841-25e4f4dc7e81', '97a17f58-f00c-11ee-bd81-c01803d475fd', '4687efcd-5e06-11ef-8e2a-b05cda965850', NULL, NULL, '2024-09-05 00:25:20', '2024-09-05 00:25:20', 0, NULL, NULL),
('aac24110-b0dd-4c4d-8e91-156370aa6e82', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '33f9c253-0060-4abb-b77c-61f92d59209d', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 01:55:44', 0, NULL, NULL),
('b4337e8e-1890-4ad4-8b87-d4e8abb75e59', '3e5565d7-0978-4b79-8643-622a9a91bb9f', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('bf2f5866-225e-4583-8428-d5477e9891ea', '3e5565d7-0978-4b79-8643-622a9a91bb9f', 'b52c27ca-bc0e-4894-abfc-e27d3ecf9df7', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 01:48:49', '2024-09-05 01:48:49', 0, NULL, NULL),
('c075bcf9-5ed0-4811-aeaa-66189290ff8c', '0968dca1-d770-4762-ab55-cee664225974', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('d3efaf33-a38d-49eb-897a-debdd2f6edb0', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '97a17f58-f00c-11ee-bd81-c01803d475fd', '636f3125-8244-426c-8905-cf8b5045aacd', NULL, NULL, '2024-07-29 07:13:19', '2024-07-29 07:13:19', 0, NULL, NULL),
('d69b6f7c-3144-4936-aae3-ad4c1291be94', '707e1956-84d2-40ec-91f5-7c0c2912e4b7', '59722a22-7ad5-42df-80c6-77218f6e5e5d', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-07-30 13:09:35', '2024-07-30 13:09:35', 0, NULL, NULL),
('d749d719-9b74-4845-ac19-4c81e406b44d', '41147b56-44a5-439c-9165-9de399ef492e', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL),
('e3a4bc78-6ee7-47b3-b3fb-1bb1340e9a8d', '3e5565d7-0978-4b79-8643-622a9a91bb9f', '33f9c253-0060-4abb-b77c-61f92d59209d', 'b459e14e-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-09-05 01:55:44', '2024-09-05 01:55:44', 0, NULL, NULL),
('e844fead-8dab-4b97-b23b-6de1b6035f8b', '0968dca1-d770-4762-ab55-cee664225974', 'ffefb57c-00ad-4f9d-8873-353c2c74fa8e', 'b459daa4-f776-11ee-baf0-c01803d4a116', NULL, NULL, '2024-08-26 03:20:24', '2024-08-26 03:20:24', 0, NULL, NULL),
('ebaf808a-3141-44b7-807f-a15a659cec26', '41147b56-44a5-439c-9165-9de399ef492e', '9dec0b8d-e973-41a0-90a3-b70d6fea4134', '09b77e81-f7cf-11ee-aa0f-c01803d4a116', NULL, NULL, '2024-08-19 07:07:07', '2024-08-19 07:07:07', 0, NULL, NULL),
('f58b9f1e-bfd7-48cc-b340-82f3ecd7c24f', 'dcd49164-3e61-40fc-9329-d930b655552d', '97a17f58-f00c-11ee-bd81-c01803d475fd', 'e09665f2-6aaf-11ef-b1d1-b05cda965850', NULL, NULL, '2024-09-05 07:19:37', '2024-09-05 07:19:37', 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `activity_members`
--
ALTER TABLE `activity_members`
  ADD PRIMARY KEY (`activity_member_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `project_member_id` (`project_member_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `sub_task_id` (`sub_task_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`division_id`),
  ADD KEY `sector_id` (`sector_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `document_type_id` (`document_type_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `document_types`
--
ALTER TABLE `document_types`
  ADD PRIMARY KEY (`document_type_id`);

--
-- Indexes for table `major_tasks`
--
ALTER TABLE `major_tasks`
  ADD PRIMARY KEY (`Major_task_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `major_task_members`
--
ALTER TABLE `major_task_members`
  ADD PRIMARY KEY (`major_task_member_id`),
  ADD KEY `Major_task_id` (`Major_task_id`),
  ADD KEY `project_member_id` (`project_member_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `organizationmedias`
--
ALTER TABLE `organizationmedias`
  ADD PRIMARY KEY (`organization_media_id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `media_id` (`media_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `division_id` (`division_id`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`project_member_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`role_permission_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`sector_id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `socialmedias`
--
ALTER TABLE `socialmedias`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `subtask_members`
--
ALTER TABLE `subtask_members`
  ADD PRIMARY KEY (`subtask_member_id`),
  ADD KEY `subtask_id` (`sub_task_id`),
  ADD KEY `project_member_id` (`project_member_id`);

--
-- Indexes for table `sub_tasks`
--
ALTER TABLE `sub_tasks`
  ADD PRIMARY KEY (`sub_task_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `task_members`
--
ALTER TABLE `task_members`
  ADD PRIMARY KEY (`task_member_id`),
  ADD KEY `project_member_id` (`project_member_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `division_id` (`division_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_role_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_members`
--
ALTER TABLE `activity_members`
  ADD CONSTRAINT `activity_members_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`),
  ADD CONSTRAINT `activity_members_ibfk_2` FOREIGN KEY (`project_member_id`) REFERENCES `project_members` (`project_member_id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`sub_task_id`) REFERENCES `sub_tasks` (`sub_task_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Constraints for table `divisions`
--
ALTER TABLE `divisions`
  ADD CONSTRAINT `divisions_ibfk_1` FOREIGN KEY (`sector_id`) REFERENCES `sectors` (`sector_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

--
-- Constraints for table `organizationmedias`
--
ALTER TABLE `organizationmedias`
  ADD CONSTRAINT `organizationmedias_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`),
  ADD CONSTRAINT `organizationmedias_ibfk_2` FOREIGN KEY (`media_id`) REFERENCES `socialmedias` (`media_id`);

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`);

--
-- Constraints for table `task_members`
--
ALTER TABLE `task_members`
  ADD CONSTRAINT `task_members_ibfk_1` FOREIGN KEY (`project_member_id`) REFERENCES `project_members` (`project_member_id`),
  ADD CONSTRAINT `task_members_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
