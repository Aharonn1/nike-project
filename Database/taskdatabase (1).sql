-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2023 at 06:58 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskdatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `kindtask`
--

CREATE TABLE `kindtask` (
  `kindTaskId` int(11) NOT NULL,
  `taskName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kindtask`
--

INSERT INTO `kindtask` (`kindTaskId`, `taskName`) VALUES
(1, 'Job Task'),
(2, 'Study Task'),
(3, 'Personal Task');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `taskId` int(11) NOT NULL,
  `kindTaskId` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `startDate` varchar(20) NOT NULL,
  `endDate` varchar(20) NOT NULL,
  `isFinish` int(1) DEFAULT NULL,
  `isArchived` int(11) DEFAULT NULL,
  `taskCount` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`taskId`, `kindTaskId`, `name`, `description`, `startDate`, `endDate`, `isFinish`, `isArchived`, `taskCount`) VALUES
(49, 1, 'Devops Engineer', 'DevOps engineer is an IT generalist who should have a wide-ranging knowledge of both development and operations, including coding, infrastructure management, system administration, and DevOps toolchai', '04-12-2023', '05-12-2023', 0, 0, 1),
(50, 2, 'Study FullStack', 'Full stack developers are the backbone of our dail.', '04-12-2023', '05-12-2023', 0, 0, 1),
(52, 3, 'Personal Task', 'Personal task management tools help you get organized and stay on track. These free and paid applications make it easy to create a new to-do list.', '04-11-2023', '05-11-2023', 1, 0, 1),
(53, 2, 'QA Study', 'Some of the most reputable QA courses and certifications include ISTQB Certified Tester, ASQ Certified Software Quality Engineer, Udemy Software Testing Courses, Coursera Software Testing Courses.', '08-12-2023', '09-12-2023', 1, 0, 1),
(54, 3, 'Personal Task', 'Personal Tasks are designed to be added quickly an.', '06-12-2023', '07-12-2023', 0, 0, 1),
(55, 1, 'FullStack Developer', 'The main task of a full-stack developer is to create a product from scratch and supervise the general flow of the project. To implement such projects.', '15-12-2023', '16-12-2023', 0, 0, 1),
(56, 1, 'Data Analyst', 'Data analysts examine information using data analysis tools and help their teams develop insights and business strategies. You\'ll need skills in math, statistics, communications.', '20-12-2023', '21-12-2023', 1, NULL, 1),
(57, 1, 'Software Architectur', 'software architecture of a system represents the design decisions related to overall system structure and behavior. Architecture helps stakeholders understand and analyze how the system will achiev.', '22-12-2023', '23-12-2023', 1, 0, 1),
(59, 2, 'Study Cyber', 'Cyber risks affect every individual and organization. This course will teach you how you can stay safe online and help protect your organization from cyber threats.', '06-11-2023', '07-11-2023', 0, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kindtask`
--
ALTER TABLE `kindtask`
  ADD PRIMARY KEY (`kindTaskId`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`taskId`),
  ADD KEY `kindTaskId` (`kindTaskId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kindtask`
--
ALTER TABLE `kindtask`
  MODIFY `kindTaskId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `taskId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`kindTaskId`) REFERENCES `kindtask` (`kindTaskId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
