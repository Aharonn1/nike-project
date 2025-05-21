-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 13, 2025 at 04:09 PM
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
-- Database: `nike`
--

-- --------------------------------------------------------

--
-- Table structure for table `categoryclothing`
--

CREATE TABLE `categoryclothing` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoryclothing`
--

INSERT INTO `categoryclothing` (`categoryId`, `categoryName`) VALUES
(1, 'shorts'),
(2, 'jackets');

-- --------------------------------------------------------

--
-- Table structure for table `categoryshoes`
--

CREATE TABLE `categoryshoes` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(30) NOT NULL,
  `sale` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoryshoes`
--

INSERT INTO `categoryshoes` (`categoryId`, `categoryName`, `sale`) VALUES
(1, 'Jordan ', 0),
(3, 'Basketball ', 0),
(7, 'Air Max ', 0),
(32, 'running ', 0);

-- --------------------------------------------------------

--
-- Table structure for table `clothing`
--

CREATE TABLE `clothing` (
  `clothingId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `title` varchar(20) NOT NULL,
  `imageName` varchar(100) NOT NULL,
  `bought` int(100) NOT NULL,
  `stock` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clothing`
--

INSERT INTO `clothing` (`clothingId`, `categoryId`, `price`, `description`, `title`, `imageName`, `bought`, `stock`) VALUES
(1, 1, 250, 'amazing', 'black', '', 0, 0),
(2, 2, 300, 'amazing', 'brown-white', '', 45, 88),
(3, 1, 350, 'amazing', 'amazing', '65761774-e72e-428b-a052-0c5146b76103.jpg', 32, 73),
(4, 2, 400, 'amazing', 'amazing', '44ebdcc4-3fea-4a44-bfbb-73e4214991d1.jpg', 23, 54),
(5, 2, 780, 'amazing', 'green', '0ed1e686-2da6-4b90-8e97-6e809b19cce8.png', 21, 83),
(6, 2, 509, 'amazing', 'white', 'cab240c5-f241-471e-8ae5-d692efd06067.jpg', 43, 15),
(7, 2, 400, 'amazing', 'white', 'dec0e719-1491-43cb-85f3-bf77b60ca802.jpg', 18, 26),
(8, 2, 500, 'amazing', 'black', '97359979-b611-40d2-9dbe-8f620f062ee0.jpg', 22, 38),
(9, 1, 300, 'clothing', 'Air Max', 'b84f18da-251e-4432-b36d-95994a5bed25.jpg', 32, 29);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commentId` bigint(20) UNSIGNED NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `shoesId` int(11) DEFAULT NULL,
  `commentText` text DEFAULT NULL,
  `commentDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`commentId`, `userId`, `shoesId`, `commentText`, `commentDate`) VALUES
(1, 71, 37, 'nice shoes ', '2025-03-02 08:47:25'),
(2, 69, 47, 'nice shoes', '2025-03-02 09:39:13'),
(3, 135, 47, 'amazing shoes', '2025-03-02 11:17:14'),
(4, 135, 13, 'Very comfortable shoes', '2025-03-03 09:50:22'),
(5, 136, 1, 'The best shoes ever', '2025-03-03 10:03:49'),
(6, 136, 3, 'I bought 2 pairs of shoes and really enjoy them', '2025-03-03 10:10:20'),
(7, 136, 13, 'Comfortable and cheap shoes', '2025-03-03 10:11:03'),
(8, 132, 1, 'Very nice shoes', '2025-03-03 10:12:46'),
(9, 132, 32, 'I bought this shoes last week and i am very happy with them', '2025-03-03 10:33:48'),
(10, 131, 1, 'The most comfortable air max shoes', '2025-03-03 10:54:09'),
(11, 131, 32, 'I bought the shoes last week a little tight but they are very beautiful', '2025-03-03 11:06:46'),
(12, 131, 37, 'I really like this version of Jordan', '2025-03-03 11:15:29'),
(13, 131, 13, 'Very nice shoes', '2025-03-03 11:27:08'),
(14, 69, 33, 'I played with them yesterday and they were very comfortable', '2025-03-03 11:29:01'),
(15, 69, 39, 'Very good shoes for running', '2025-03-03 11:30:16'),
(16, 69, 36, 'Very good shoes and very high quality', '2025-03-03 11:31:13'),
(17, 69, 38, 'I bought this shoes last week and I am happy with them', '2025-03-03 11:37:04'),
(18, 69, 58, 'Very comfortable shoes', '2025-03-03 11:38:48'),
(19, 71, 33, 'Very special shoes', '2025-03-03 11:41:10'),
(20, 71, 36, 'I really liked the design of the shoes', '2025-03-03 11:41:49'),
(21, 71, 13, 'I got a lot of compliments on these shoes', '2025-03-03 11:44:26'),
(22, 71, 51, 'One of Jordan\'s most beautiful shoes', '2025-03-03 11:48:00'),
(23, 71, 55, 'This shoes are very comfortable and fun to play with', '2025-03-03 11:49:21'),
(24, 69, 56, 'This shoes are very comfortable for playing', '2025-03-04 06:43:33'),
(25, 69, 51, 'This is the best shoes that Jordan has released in the last year', '2025-03-04 06:45:08'),
(26, 132, 39, 'The best shoes I have bought in the last year', '2025-03-04 08:03:24'),
(27, 135, 48, 'Very nice shoes', '2025-03-11 11:16:38'),
(28, 135, 1, 'very nice ', '2025-03-11 14:30:14'),
(29, 135, 33, 'Very good shoes ', '2025-03-16 15:17:19'),
(30, 135, 55, 'Very nice shoes', '2025-03-17 17:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `favorite`
--

CREATE TABLE `favorite` (
  `userId` int(11) NOT NULL,
  `shoesId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorite`
--

INSERT INTO `favorite` (`userId`, `shoesId`) VALUES
(12, 32),
(12, 34),
(12, 38),
(17, 13),
(17, 32),
(17, 36),
(69, 13),
(69, 51),
(69, 56),
(71, 3),
(71, 13),
(71, 14),
(132, 34),
(132, 37),
(132, 39),
(134, 36),
(134, 48),
(134, 50),
(134, 51),
(134, 54),
(134, 58),
(135, 38),
(135, 39),
(136, 33),
(136, 39),
(137, 33),
(137, 39),
(137, 51);

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `imageId` int(11) NOT NULL,
  `imageName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`imageId`, `imageName`) VALUES
(1, 'air-max-pulse-mens-shoes-DWTVpN.jpg'),
(2, 'D4hr5TEW4AAcZFt.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `shoesId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `orderDate` timestamp NULL DEFAULT NULL,
  `sizeId` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `orderStatus` enum('Pending','Completed') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `userId`, `shoesId`, `quantity`, `orderDate`, `sizeId`, `status`, `orderStatus`) VALUES
(4604, 71, 39, 1, '2025-02-18 07:56:47', 41, 1, NULL),
(4605, 71, 39, 1, '2025-02-18 07:56:47', 41, 1, NULL),
(4612, 71, 33, 1, '2025-02-18 09:35:02', 41, 1, NULL),
(4614, 69, 1, 1, '2025-02-18 11:35:43', 41, 1, NULL),
(4615, 69, 38, 1, '2025-02-18 11:35:43', 40, 1, NULL),
(4617, 71, 1, 1, '2025-02-20 16:12:51', 41, 1, NULL),
(4619, 71, 14, 1, '2025-02-20 16:12:51', 41, 1, NULL),
(4622, 131, 21, 1, '2025-02-20 16:59:46', 43, 1, NULL),
(4623, 131, 36, 1, '2025-02-20 16:59:46', 43, 1, NULL),
(4626, 132, 32, 1, '2025-02-20 17:12:35', 40, 1, NULL),
(4627, 134, 38, 1, '2025-02-20 17:16:51', 41, 1, NULL),
(4628, 134, 39, 1, '2025-02-20 17:16:51', 41, 1, NULL),
(4631, 134, 34, 1, '2025-02-26 16:17:02', 41, 1, NULL),
(4634, 134, 33, 1, '2025-02-26 16:17:02', 41, 1, NULL),
(4637, 132, 39, 1, '2025-03-04 08:04:19', 41, 1, NULL),
(4638, 132, 34, 1, '2025-03-04 08:04:19', 42, 1, NULL),
(4640, 135, 59, 1, '2025-02-27 12:42:32', 42, 1, NULL),
(4641, 135, 55, 1, '2025-02-27 12:42:32', 42, 1, NULL),
(4642, 136, 39, 1, '2025-02-27 15:42:45', 44, 1, NULL),
(4643, 136, 39, 1, '2025-02-27 15:42:45', 44, 1, NULL),
(4644, 136, 33, 1, '2025-02-27 15:42:45', 44, 1, NULL),
(4647, 135, 32, 1, '2025-02-27 16:15:24', 40, 1, NULL),
(4648, 135, 21, 1, '2025-02-27 16:15:24', 41, 1, NULL),
(4649, 69, 56, 1, '2025-03-03 22:00:00', 41, 1, NULL),
(4650, 69, 51, 1, '2025-03-03 22:00:00', 41, 1, NULL),
(4651, 69, 51, 1, '2025-03-04 06:45:32', 41, 1, NULL),
(4652, 132, 39, 1, '2025-03-04 08:04:19', 41, 1, NULL),
(4653, 132, 1, 1, '2025-03-05 07:22:48', 41, 1, NULL),
(4655, 132, 39, 1, '2025-03-05 07:22:48', 40, 1, NULL),
(4656, 132, 39, 1, '2025-03-05 07:22:48', 40, 1, NULL),
(4657, 132, 52, 1, '2025-03-09 13:52:51', 41, 1, NULL),
(4658, 132, 52, 1, '2025-03-09 13:52:51', 41, 1, NULL),
(4659, 132, 48, 1, '2025-03-09 13:52:52', 41, 1, NULL),
(4665, 135, 48, 1, '2025-03-11 14:31:59', 42, 1, NULL),
(4666, 135, 33, 1, '2025-03-11 14:31:59', 41, 1, NULL),
(4668, 135, 48, 1, '2025-03-11 14:31:59', 42, 1, NULL),
(4674, 135, 32, 1, '2025-03-17 17:33:35', 40, 1, NULL),
(4675, 135, 32, 1, '2025-03-17 17:33:35', 40, 1, NULL),
(4676, 69, 33, 1, '2025-03-18 15:32:18', 41, 1, NULL),
(4677, 69, 35, 1, '2025-03-18 15:32:18', 41, 1, NULL),
(4678, 69, 35, 1, '2025-03-18 15:32:18', 41, 1, NULL),
(4679, 69, 14, 1, '2025-03-23 07:20:10', 41, 1, NULL),
(4680, 136, 55, 1, '2025-03-27 06:56:51', 42, 1, NULL),
(4681, 136, 55, 1, '2025-03-27 06:56:51', 42, 1, NULL),
(4682, 136, 33, 1, '2025-04-03 06:07:09', 44, 1, NULL),
(4683, 136, 33, 1, '2025-04-03 06:07:09', 44, 1, NULL),
(4684, 136, 38, 1, '2025-04-10 14:30:29', 41, 1, NULL),
(4685, 136, 38, 1, '2025-04-10 14:30:29', 41, 1, NULL),
(4686, 136, 51, 1, '2025-04-10 14:30:29', 41, 1, NULL),
(4914, 136, 35, 1, NULL, 41, 0, NULL),
(5119, 136, 35, 1, NULL, 41, 0, NULL),
(5124, 136, 14, 1, NULL, 40, 0, NULL),
(5126, 137, 48, 1, '2025-04-21 17:39:54', 41, 1, NULL),
(5127, 137, 55, 1, '2025-04-21 17:39:54', 41, 1, NULL),
(5128, 137, 48, 1, '2025-04-21 17:39:54', 41, 1, NULL),
(5129, 137, 34, 1, NULL, 42, 0, NULL),
(5130, 69, 58, 1, '2025-04-22 16:56:02', 42, 1, NULL),
(5132, 69, 58, 1, '2025-04-22 16:56:02', 42, 1, NULL),
(5135, 69, 45, 1, '2025-04-22 16:56:02', 41, 1, 'Pending'),
(5136, 69, 45, 1, '2025-04-22 16:56:02', 41, 1, 'Pending'),
(5141, 69, 14, 1, '2025-04-28 16:25:27', 41, 1, 'Pending'),
(5142, 69, 13, 1, '2025-04-28 16:25:27', 45, 1, 'Pending'),
(5145, 69, 34, 1, '2025-04-28 16:52:05', 42, 1, 'Pending'),
(5146, 137, 52, 1, NULL, 41, 0, 'Pending'),
(5147, 137, 52, 1, NULL, 41, 0, 'Pending'),
(5148, 137, 32, 1, NULL, 40, 0, 'Pending'),
(5152, 134, 54, 1, '2025-04-30 19:58:32', 41, 1, 'Pending'),
(5153, 134, 58, 1, '2025-04-30 19:58:32', 41, 1, 'Pending'),
(5155, 134, 58, 1, '2025-04-30 19:58:32', 41, 1, 'Pending'),
(5157, 134, 33, 1, '2025-05-01 17:13:48', 43, 1, 'Pending'),
(5158, 134, 33, 1, '2025-05-01 17:13:48', 40, 1, 'Pending'),
(5159, 134, 33, 1, '2025-05-01 17:13:48', 40, 1, 'Pending'),
(5160, 134, 33, 1, '2025-05-01 17:13:48', 40, 1, 'Pending'),
(5161, 134, 36, 1, '2025-05-01 17:13:48', 42, 1, 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `paymentId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `orderId` int(11) DEFAULT NULL,
  `paymentType` enum('Pickup','Delivery') NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shoes`
--

CREATE TABLE `shoes` (
  `shoesId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `bought` int(100) NOT NULL,
  `stock` int(100) NOT NULL,
  `imageLink` varchar(250) NOT NULL,
  `imageName` varchar(200) NOT NULL,
  `shoppingBasket` int(11) NOT NULL,
  `favorite` int(11) NOT NULL,
  `imageNameFront` varchar(200) NOT NULL,
  `imageNameAbove` varchar(200) NOT NULL,
  `imageNameBack` varchar(200) NOT NULL,
  `imageNameDown` varchar(200) NOT NULL,
  `video` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shoes`
--

INSERT INTO `shoes` (`shoesId`, `categoryId`, `description`, `price`, `title`, `bought`, `stock`, `imageLink`, `imageName`, `shoppingBasket`, `favorite`, `imageNameFront`, `imageNameAbove`, `imageNameBack`, `imageNameDown`, `video`) VALUES
(1, 7, 'Transport your style with a new Air Max. The Portal is the perfect blend of chunky and sleek, combining the platform. ', 550, 'Air Max', 271, 16, 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/ed95a1f5-5f45-45c1-9a0d-6aed6e0a7cd9/NIKE+AIR+MAX+1.jpg', 'AIR+MAX+DN.jpg', 0, 0, 'AIR+MAX+DNFront.jpg', 'AIR+MAX+DNAbove.jpg', 'AIR+MAX+DNBack.jpg', 'AIR+MAX+DNDown.jpg', 'video.mp4'),
(3, 1, 'Always in, always fresh. The Air Jordan 1 Low sets you up with a piece of Jordan history and heritage.', 800, 'Air Jordan ', 116, 53, 'https://static.nike.com/a/images/t_default/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fd239f1-cb1d-4de6-a299-9a961bdb220c/W+AIR+JORDAN+1+ELEVATE+HIGH+SE.png', 'a34c361c-6afb-4f0b-9ab0-b07ded323874.jpg', 0, 0, 'AIR+JORDAN+1+Front.jpg', 'AIR+JORDAN+1Above.jpg', 'AIR+JORDAN+1Back.jpg', 'AIR+JORDAN+1Down.jpg', 'video2.mp4'),
(13, 3, 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best. ', 550, 'Air Force', 44, 63, 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/aa091836-6571-400b-8de2-56c3bf2b1be6/AIR+FORCE+1+%28GS%29.png', 'AIR+FORCE+1.jpg', 0, 0, 'AIR+FORCE+1+Front.jpg', 'AIR+FORCE+1Above.jpg', 'AIR+FORCE+1Back.jpg', 'AIR+FORCE+Down.jpg', 'video3.mp4'),
(14, 3, 'What would it feel like to lace a pair of clouds to your feet? You\'ll never know, but we think the Nike Wearal.', 400, 'Nike Air VaporMax', 51, 2, 'https://en-kw.sssports.com/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dw0d3324e9/sss/SSS2/N/K/C/J/1/SSS2_NKCJ1682_002_194276356142_1.jpg?sw=700&sh=700&sm=fit', 'AIR+VAPORMAX+2023+FK.jpg', 0, 0, 'AIR+VAPORMAX+2023+FKFront.jpg', 'AIR+VAPORMAX+2023+FKAbove.jpg', 'AIR+VAPORMAX+2023+FKBack.jpg', 'AIR+VAPORMAX+2023+FKDown.jpg', 'video 16.mp4'),
(21, 3, 'Responsive cushioning in the winterized Pegasus provides an energised ride for everyday road running, day or night.', 450, 'Downshifter 11\n', 26, 30, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAcXLc5RcIt1BIhp6kkD5cfAMd1blvCFawcA&s', 'NIKE+DOWNSHIFTER+11.jpg', 0, 0, 'W+NIKE+DOWNSHIFTER+11Front.jpg', 'W+NIKE+DOWNSHIFTER+Above.jpg', 'W+NIKE+DOWNSHIFTER+Back.jpg', 'W+NIKE+DOWNSHIFTER+Down.jpg', 'video4.mov'),
(30, 1, 'Created for the hardwood but taken to the streets, the \'80s b-ball icon returns with perfectly shined overlays and classic team.', 500, ' Dunk Low Retro', 37, 13, 'https://365mashbir.co.il/cdn/shop/files/Untitled_1000x1500px_-2024-04-18T161544.816.jpg?v=1713446195', 'NIKE+DUNK+LOW+RETRO.jpg', 0, 0, 'NIKE+DUNK+LOW+RETROFront.jpg', 'NIKE+DUNK+LOW+RETROAbove.jpg', 'NIKE+DUNK+LOW+RETROBack.jpg', 'NIKE+DUNK+LOW+RETRODown.jpg', 'video5.mp4'),
(31, 32, 'One of our most versatile shoes for all athletes, now made from at least 20% recycled material by weight.', 400, 'Revolution 6 ', 5, 55, 'https://www.jdsports.co.il/cdn/shop/products/jd_DC3728-003_plc_1200x.jpg?v=1684245792', 'REVOLUTION+6+FLYEASE+NN.jpg', 0, 0, 'REVOLUTION+6+FLYEASE+Front.jpg', 'REVOLUTION+6+FLYEASE+Above.jpg', 'REVOLUTION+6+FLYEASE+Back.jpg', 'REVOLUTION+6+FLYEASE+Down.jpg', 'video6.mov'),
(32, 32, 'Power up every run in the Peg 41. The responsive Air Zoom cushioning helps make your miles feel soft and springy.', 460, 'Nike Pegasus', 15, 85, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/88647ece-9b25-4353-8d0c-3e340986cdb4/NIKE+PEGASUS+TRAIL+5+GTX.png', 'NIKE+PEGASUS+TRAIL+5+GTX.jpg', 0, 0, 'NIKE+PEGASUS+TRAIL+5+GTX.jpg', 'NIKE+PEGASUS+TRAIL+5+Above.jpg', 'NIKE+PEGASUS+TRAIL+5+Back.jpg', 'NIKE+PEGASUS+TRAIL+5+Down.jpg', 'video7.mp4'),
(33, 3, 'For context, Breaking Bad is one of my favorite shows ever. The way they introduce the Saul Goodman good shoes.', 550, 'Nike G.T.', 17, 83, 'https://assets.adidas.com/images/w_1880,f_auto,q_auto/471a347143ec4a11b358dd3df841f40f_9366/IG6582_HM3_hover.jpg', 'NIKE+JUNIPER+TRAIL+2+GTX+V2.jpg', 0, 0, 'NIKE+JUNIPER+TRAIL+2+GTX+Front.jpg', 'NIKE+JUNIPER+TRAIL+2+GTX+Above.jpg', 'NIKE+JUNIPER+TRAIL+2+GTX+Back.jpg', 'NIKE+JUNIPER+TRAIL+2+GTX+Down.jpg', 'video 11.mp4'),
(34, 7, 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.', 650, 'Air Max 270', 9, 91, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/AIR+MAX+270.png', 'AIR+MAX+270.jpg', 0, 0, 'AIR+MAX+270Front.jpg', 'AIR+MAX+270Above.jpg', 'AIR+MAX+270Back.jpg', 'AIR+MAX+270Down.jpg', 'video10.mov'),
(35, 7, 'The Nike Air Max 97 is the shoe that will have you walking on Air—literally! This icon was the first to showcase.', 670, 'Nike Air Max 97', 4, 96, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f239fd46-65cf-4e15-bd95-130df5a63f48/NIKE+AIR+MAX+97+%28GS%29.png', 'custom-nike-air-max-97.jpg', 0, 0, 'custom-nike-air-max-97-Front.jpg', 'custom-nike-air-max-97-Above.jpg', 'custom-nike-air-max-97-Back.jpg', 'custom-nike-air-max-97-Down.jpg', 'video 9.mp4'),
(36, 7, 'The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max.', 690, 'Nike Air Max Pulse', 4, 96, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/671fc01d-5205-4a54-8349-0b9eae869dac/NIKE+AIR+MAX+PULSE.png', 'NIKE+AIR+MAX+PULSE.jpg', 0, 0, 'NIKE+AIR+MAX+PULSE+Front.jpg', 'NIKE+AIR+MAX+PULSE+Above.jpg', 'NIKE+AIR+MAX+PULSE+Back.jpg', 'NIKE+AIR+MAX+PULSE+Down.jpg', 'video 8.mp4'),
(37, 1, 'Accelerate, bank, shoot, score—then repeat. Russell Westbrook\'s latest shoe is here to assist your speed game.', 540, 'Jordan One Take 5\n', 4, 96, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/620cf674-4356-4760-a20e-6ae18f286edb/NIKE+AIR+MAX+PLUS+GS.png', 'JORDAN+ONE+TAKE+5.jpg', 0, 0, 'JORDAN+ONE+TAKE+5Front.jpg', 'JORDAN+ONE+TAKE+5Above.jpg', 'JORDAN+ONE+TAKE+5Back.jpg', 'JORDAN+ONE+TAKE+5Down.jpg', 'video 12.mp4'),
(38, 1, 'These AJ1s have been created in collaboration with Jordan, American rapper Travis Scott and Hiroshi.', 720, 'Nike Structure 25\n', 106, 46, 'https://cdn-images.farfetch-contents.com/19/98/96/63/19989663_52070831_1000.jpg', 'AIR+ZOOM+STRUCTURE+25+WIDE.jpg', 0, 0, 'AIR+ZOOM+STRUCTURE+25+WIDEFront.jpg', 'AIR+ZOOM+STRUCTURE+25+WIDEAbove.jpg', 'AIR+ZOOM+STRUCTURE+25+WIDEBack.jpg', 'AIR+ZOOM+STRUCTURE+25+WIDEDown.jpg', 'video 13.mp4'),
(39, 3, 'You gotta know where you\'ve been to know where you\'re going. We took that to heart when creating the Stay Loyal.', 750, 'Nike Free Metcon 5\n', 13, 87, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7c498975-150c-46bc-a73b-25ae861bff4b/JORDAN+STAY+LOYAL+3.png', 'NIKE+FREE+METCON+5.jpg', 0, 0, 'NIKE+FREE+METCON+5Front.jpg', 'NIKE+FREE+METCON+5Above.jpg', 'NIKE+FREE+METCON+5Back.jpg', 'NIKE+FREE+METCON+5Down.jpg', 'video 14.mp4'),
(40, 32, 'We loaded the Revolution 7 with the sort of soft cushioning and support that might change your running world.', 680, 'Nike Initiator\n', 0, 100, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d76b79fd-e11d-458d-8177-fa1746921e21/W+NIKE+REVOLUTION+7.png', 'NIKE+INITIATOR.jpg', 0, 0, 'NIKE+INITIATORFront.jpg', 'NIKE+INITIATORAbove.jpg', 'NIKE+INITIATORBack.jpg', 'NIKE+INITIATORDown.jpg', 'video 15.mp4'),
(45, 1, 'Quality construction with legacy style? Expect nothing less from the AJ1. Fresh colour-blocking brings big university feels to this special.', 600, 'Air Jordan 1 Low SE', 58, 38, '', 'AIR+JORDAN+1+LOW+SE.jpg', 0, 0, 'AIR+JORDAN+1+LOW+SE..Up.jpg', 'AIR+JORDAN+1+LOW+SE.Above.jpg', 'AIR+JORDAN+1+LOW+SE.Back.jpg', 'AIR+JORDAN+1+LOW+SE..Down.jpg', 'video (20).mp4'),
(46, 32, 'Flexible and breathable, the Nike SB Chron 2 is a sequel worthy of its predecessor.The revamped design includes a reshaped collar.', 550, 'Nike SB Chron 2', 25, 17, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/766567e3-8685-4f9e-8471-33baffaab89c/NIKE+SB+CHRON+2.png', 'NIKE+SB+CHRON+2.jpg', 0, 0, 'NIKE+SB+CHRON+2.Front.jpg', 'NIKE+SB+CHRON+2.Above.jpg', 'NIKE+SB+CHRON+2.Back.jpg', 'NIKE+SB+CHRON+2.Down.jpg', 'video (21).mp4'),
(47, 1, 'Bring on undeniable style with these special edition AJ1s. Premium leathers collide with durable nylon to give you a luxe upper.', 570, 'Air Jordan 1 Low', 12, 25, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c5f79a3f-130c-4f6a-b395-2d8280be15de/AIR+JORDAN+1+LOW+SE.png', 'AIR+JORDAN+1+LOW+SE.1jpg.jpg', 0, 0, 'AIR+JORDAN+1+LOW+SE1.Front.jpg', 'AIR+JORDAN+1+LOW+SE1.Above.jpg', 'AIR+JORDAN+1+LOW+SE1.Back.jpg', 'AIR+JORDAN+1+LOW+SE1.jpg', 'video (22).mp4'),
(48, 32, 'We loaded the Revolution 7 with the sort of soft cushioning and support that might change your running world.', 450, 'Nike Revolution 7', 19, 16, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/48287ddd-4b87-4cc5-a2a3-dd0bdb3b5154/NIKE+REVOLUTION+7.png', 'NIKE+REVOLUTION+17.jpg', 0, 0, 'NIKE+REVOLUTION+17.Front.jpg', 'NIKE+REVOLUTION+17.Above.jpg', 'NIKE+REVOLUTION+17.Back.jpg', 'NIKE+REVOLUTION+17.Down.jpg', 'video (23).mp4'),
(49, 32, 'Maximum cushioning provides our most comfortable ride for everyday runs. Experience a breathable Flyknit upper and the robust platform.', 580, 'Nike Invincible 3', 10, 18, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/05101027-9c5a-4b75-b257-2e9f0627acf3/NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.png', 'NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.jpg', 0, 0, 'NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.Front.jpg', 'NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.Above.jpg', 'NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.Back.jpg', 'NIKE+ZOOMX+INVINCIBLE+RUN+FK+3.Down.jpg', 'video (24).mp4'),
(50, 32, 'Maximum cushioning provides our most comfortable ride for everyday runs. Experience a breathable Flyknit upper and the robust platform.', 590, 'Nike Invincible 4', 9, 11, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9dcdc903-2860-4efa-81bd-ffffeb788e47/ZOOMX+INVINCIBLE+RUN+3+WIDE.png', 'ZOOMX+INVINCIBLE+RUN+3+WIDE.jpg', 0, 0, 'ZOOMX+INVINCIBLE+RUN+3+WIDE.jpg', 'ZOOMX+INVINCIBLE+RUN+3+WIDE.Above.jpg', 'ZOOMX+INVINCIBLE+RUN+3+WIDE.Back.jpg', 'ZOOMX+INVINCIBLE+RUN+3+WIDE.Down.jpg', 'video (25).mp4'),
(51, 1, 'Does it get any more classic than black and white? The lightweight, responsive foam and court-ready tech in the Luka 3.', 650, 'Luka 3 \'Speedway\'', 12, 18, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/2fd71a36-68fc-4d19-9fa4-2ed034d4e747/JORDAN+LUKA+3.png', 'JORDAN+LUKA+3.jpg', 0, 0, 'JORDAN+LUKA+3.Front.jpg', 'JORDAN+LUKA+3.Above.jpg', 'JORDAN+LUKA+3.Back.jpg', 'JORDAN+LUKA+3.Down.jpg', 'video (26).mp4'),
(52, 1, 'We didn\'t invent the remix—but considering the material we get to sample, this one\'s a no-brainer. We took elements from the AJ6.', 700, 'Jumpman MVP', 17, 15, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a4ac1985-5f2d-4571-80c8-44afb1669f43/JORDAN+MVP.png', 'JORDAN+MVP.jpg', 0, 0, 'JORDAN+MVP.Front.jpg', 'JORDAN+MVP.Above.jpg', 'JORDAN+MVP.Back.jpg', 'JORDAN+MVP.Down.jpg', 'video (27).mp4'),
(53, 3, 'Calm under pressure. That\'s Jayson in a nutshell. Sure, he hears the back and forth, but he doesn\'t let the pressure get to him.', 650, 'Tatum 3 \'Zen\'', 11, 23, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a26ebb08-0014-4ed4-8aca-a3bfe9895fa6/JORDAN+TATUM+3.png', 'JORDAN+TATUM+3.jpg', 0, 0, 'JORDAN+TATUM+3.Front.jpg', 'JORDAN+TATUM+3.Above.jpg', 'JORDAN+TATUM+3.Back.jpg', 'JORDAN+TATUM+3.Down.jpg', 'video (28).mp4'),
(54, 32, 'Put in miles with the comfortable support of the Nike Initiator. It has a breathable upper with a soft.', 540, 'Nike Initiator', 10, 12, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6def0a91-2063-49d7-8b51-20bd12e980f4/NIKE+INITIATOR.png', 'NIKE+INITIATOR.1.jpg', 0, 0, 'NIKE+INITIATOR1.Front.jpg', 'NIKE+INITIATOR1.Above.jpg', 'NIKE+INITIATOR1.Back.jpg', 'NIKE+INITIATOR1.Down.jpg', 'video (30).mp4'),
(55, 3, 'Score at will at the rim or from deep in the Nike Precision 7. Crafted with a combination of ground control.', 630, 'Nike Precision 7', 27, 8, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8ece4b20-d4dd-446a-bb67-451813676297/NIKE+PRECISION+VII.png', 'NIKE+PRECISION+VII.jpg', 0, 0, 'NIKE+PRECISION+VII.Front.jpg', 'NIKE+PRECISION+VII.Above.jpg', 'NIKE+PRECISION+VII.Back.jpg', 'NIKE+PRECISION+VII.Down.jpg', 'video (31).mp4'),
(56, 3, 'How high do you want to fly? Get off the ground quicker in a design that helps you hover and hold your own in the air.', 640, 'Nike G.T. Jump 2 ', 14, 21, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/abb8771c-602f-48eb-ac4b-32861c97e0ee/NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.png', 'NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.jpg', 0, 0, 'NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.Front.jpg', 'NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.Above.jpg', 'NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.Back.jpg', 'NIKE+AIR+ZOOM+G.T.+JUMP+2+OLY.Down.jpg', 'video (33).mp4'),
(57, 7, 'Let your attitude have the edge in your Nike Air Max Plus, a Tuned Air experience that offers premium stability.', 670, 'Nike Air Max Plus', 13, 22, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/877d30e7-4880-46f8-aa71-6704eb7d944d/AIR+MAX+PLUS.png', 'AIR+MAX+PLUS1.jpg', 0, 0, 'AIR+MAX+PLUS.Front.jpg', 'AIR+MAX+PLUS.Above.jpg', 'AIR+VAPORMAX+2023+FKBack.jpg', 'AIR+VAPORMAX+2023+FKDown.jpg', 'video (34).mp4'),
(58, 7, 'Let your attitude have the edge in the Air Max Plus. Its iconic caging adds heat to your look while airy mesh keeps you cool.', 550, 'Nike Air Max Plus', 19, 22, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e5b8727d-29da-4556-8a2c-a0672a3eed4d/NIKE+AIR+MAX+PLUS.png', 'NIKE+AIR+MAX+PLUS12.jpg', 0, 0, 'NIKE+AIR+MAX+PLUS.Front.jpg', 'NIKE+AIR+MAX+PLUS.Above.jpg', 'NIKE+AIR+MAX+PLUS.Back.jpg', 'NIKE+AIR+MAX+PLUS12.Down.jpg', 'video (35).mp4'),
(59, 7, 'Nothing as fly, nothing as comfortable, nothing as proven.The Nike Air Max 90 stays true to its OG running roots with the iconic.', 580, 'Nike Air Max 90', 20, 14, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/zwxes8uud05rkuei1mpt/AIR+MAX+90.png', 'AIR+MAX+90.jpg', 0, 0, 'AIR+MAX+90Front.jpg', 'AIR+MAX+90Above.jpg', 'AIR+MAX+90Back.jpg', 'AIR+MAX+90Down.jpg', 'video (36).mp4'),
(60, 7, 'Inspired by the beach but made for city streets, the Nike Air Max Plus Utility gets a rugged upgrade perfect for your urban adventures.', 640, 'Air Max Plus Utility', 9, 14, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/84fdcee0-c38c-443c-bfef-2c5148438bd9/NIKE+AIR+MAX+PLUS+UTILITY.png', 'NIKE+AIR+MAX+PLUS+UTILITY.jpg', 0, 0, 'NIKE+AIR+MAX+PLUS+UTILITY.Front.jpg', 'NIKE+AIR+MAX+PLUS+UTILITY.Above.jpg', 'NIKE+AIR+MAX+PLUS+UTILITY.Back.jpg', 'NIKE+AIR+MAX+PLUS+UTILITY.Down.jpg', 'video (38).mp4');

-- --------------------------------------------------------

--
-- Table structure for table `shoesize`
--

CREATE TABLE `shoesize` (
  `shoesId` int(11) NOT NULL,
  `sizeId` int(11) NOT NULL,
  `stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shoesize`
--

INSERT INTO `shoesize` (`shoesId`, `sizeId`, `stock`) VALUES
(1, 40, 0),
(1, 41, 0),
(1, 42, 0),
(1, 43, 0),
(1, 44, 0),
(1, 45, 0),
(3, 40, 0),
(3, 41, 0),
(3, 42, 0),
(3, 43, 0),
(3, 44, 0),
(3, 45, 0),
(13, 40, 0),
(13, 41, 0),
(13, 42, 0),
(13, 43, 0),
(13, 44, 0),
(13, 45, 2),
(14, 40, 4),
(14, 41, 2),
(14, 42, 5),
(14, 43, 5),
(14, 44, 0),
(14, 45, 5),
(21, 40, 5),
(21, 41, 4),
(21, 42, 5),
(21, 43, 4),
(21, 44, 0),
(21, 45, 0),
(30, 40, 0),
(30, 41, 0),
(30, 42, 3),
(30, 43, 2),
(30, 44, 0),
(30, 45, 0),
(31, 40, 0),
(31, 41, 0),
(31, 42, 0),
(31, 43, 0),
(31, 44, 0),
(31, 45, 0),
(32, 40, 0),
(32, 41, 0),
(32, 42, 0),
(32, 43, 5),
(32, 44, 1),
(32, 45, 0),
(33, 40, 1),
(33, 41, 0),
(33, 42, 0),
(33, 43, 1),
(33, 44, 2),
(33, 45, 3),
(34, 40, 0),
(34, 41, 0),
(34, 42, 2),
(34, 43, 5),
(34, 44, 0),
(34, 45, 4),
(35, 40, 3),
(35, 41, 0),
(35, 42, 0),
(35, 43, 0),
(35, 44, 5),
(35, 45, 0),
(36, 40, 2),
(36, 41, 0),
(36, 42, 4),
(36, 43, 2),
(36, 44, 5),
(36, 45, 0),
(37, 40, 5),
(37, 41, 0),
(37, 42, 5),
(37, 43, 5),
(37, 44, 0),
(37, 45, 5),
(38, 40, 4),
(38, 41, 2),
(38, 42, 0),
(38, 43, 0),
(38, 44, 2),
(38, 45, 5),
(39, 40, 0),
(39, 41, 0),
(39, 42, 0),
(39, 43, 0),
(39, 44, 3),
(39, 45, 5),
(40, 40, 3),
(40, 41, 2),
(40, 42, 5),
(40, 43, 4),
(40, 44, 0),
(40, 45, 5),
(45, 40, 5),
(45, 41, 3),
(45, 42, 0),
(45, 43, 5),
(45, 44, 5),
(45, 45, 0),
(46, 40, 3),
(46, 41, 4),
(46, 42, 0),
(46, 43, 2),
(46, 44, 5),
(46, 45, 0),
(47, 40, 2),
(47, 41, 3),
(47, 42, 4),
(47, 43, 2),
(47, 44, 0),
(47, 45, 0),
(48, 40, 3),
(48, 41, 1),
(48, 42, 0),
(48, 43, 0),
(48, 44, 0),
(48, 45, 3),
(49, 40, 0),
(49, 41, 3),
(49, 42, 0),
(49, 43, 4),
(49, 44, 2),
(49, 45, 3),
(50, 40, 0),
(50, 41, 3),
(50, 42, 5),
(50, 43, 0),
(50, 44, 2),
(50, 45, 4),
(51, 40, 0),
(51, 41, 0),
(51, 42, 2),
(51, 43, 4),
(51, 44, 3),
(51, 45, 2),
(52, 40, 0),
(52, 41, 0),
(52, 42, 3),
(52, 43, 2),
(52, 44, 5),
(52, 45, 4),
(53, 40, 3),
(53, 41, 2),
(53, 42, 2),
(53, 43, 4),
(53, 44, 2),
(53, 45, 4),
(54, 40, 0),
(54, 41, 2),
(54, 42, 0),
(54, 43, 3),
(54, 44, 4),
(54, 45, 3),
(55, 40, 0),
(55, 41, 0),
(55, 42, 1),
(55, 43, 0),
(55, 44, 2),
(55, 45, 4),
(56, 40, 0),
(56, 41, 2),
(56, 42, 4),
(56, 43, 3),
(56, 44, 2),
(56, 45, 2),
(57, 40, 3),
(57, 41, 0),
(57, 42, 4),
(57, 43, 0),
(57, 44, 3),
(57, 45, 5),
(58, 40, 3),
(58, 41, 0),
(58, 42, 0),
(58, 43, 0),
(58, 44, 2),
(58, 45, 4),
(59, 40, 3),
(59, 41, 0),
(59, 42, 3),
(59, 43, 2),
(59, 44, 2),
(59, 45, 4),
(60, 40, 0),
(60, 41, 3),
(60, 42, 4),
(60, 43, 3),
(60, 44, 2),
(60, 45, 4);

-- --------------------------------------------------------

--
-- Table structure for table `size`
--

CREATE TABLE `size` (
  `sizeId` int(11) NOT NULL,
  `sizeName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `size`
--

INSERT INTO `size` (`sizeId`, `sizeName`) VALUES
(40, 'size40'),
(41, 'size41'),
(42, 'size42'),
(43, 'size43'),
(44, 'size44'),
(45, 'size45');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(256) NOT NULL,
  `role` varchar(11) NOT NULL,
  `registrationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updateStock` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `role`, `registrationDate`, `updateStock`) VALUES
(3, 'Admin', 'Admin', 'Admin@gmail.com', '123456', 'Admin', '2024-10-06 13:48:09', 0),
(12, 'John', 'Doe', 'johndoe@example.com', '475594658ee267ed38042cd53243a6e8870a2e3f1f68b78b537cad8cddfd6d7ba924dfd617da21f10268e3d9938b196db8c8dc1a86cc578d999f9ac7b20a7e77', 'User', '2024-10-06 13:48:17', 0),
(17, 'Bruno', 'Frenandesh', 'Bruno@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2024-12-22 19:01:21', 1),
(69, 'Elon', 'Musk', 'Elon@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-04-06 11:30:07', 1),
(71, 'Bill', 'Gates', 'Bill@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2024-10-21 14:51:47', 1),
(131, 'Mark', 'Zuckerberg', 'Mark@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-02-20 16:53:39', 1),
(132, 'Larry', 'Ellison', 'Larry@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-02-20 17:10:09', 1),
(134, 'Larry', 'Page', 'Page@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-02-20 17:16:00', 1),
(135, 'Jeff', 'Bezos', 'Bezos@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-02-27 12:32:01', 1),
(136, 'Sergey', 'Brin', 'Sergey@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-02-27 15:39:37', 1),
(137, 'Tim', 'Cook', 'Cook@gmail.com', '1858b86f3f3a647595ac7411f443c419bd55d211514e381fde7257c4261b784c2980407bccbe436f0a34fd3607e5ad94e1e35aa41944d1cfbcc71d8aa35e6607', 'User', '2025-04-06 17:09:04', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categoryclothing`
--
ALTER TABLE `categoryclothing`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `categoryshoes`
--
ALTER TABLE `categoryshoes`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `clothing`
--
ALTER TABLE `clothing`
  ADD PRIMARY KEY (`clothingId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentId`),
  ADD KEY `fk_comments_users` (`userId`),
  ADD KEY `fk_comments_shoes` (`shoesId`);

--
-- Indexes for table `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`userId`,`shoesId`),
  ADD KEY `shoesId` (`shoesId`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`imageId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `shoesId` (`shoesId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `orderId` (`orderId`);

--
-- Indexes for table `shoes`
--
ALTER TABLE `shoes`
  ADD PRIMARY KEY (`shoesId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `shoesize`
--
ALTER TABLE `shoesize`
  ADD PRIMARY KEY (`shoesId`,`sizeId`),
  ADD KEY `sizeId` (`sizeId`);

--
-- Indexes for table `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`sizeId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categoryclothing`
--
ALTER TABLE `categoryclothing`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categoryshoes`
--
ALTER TABLE `categoryshoes`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `clothing`
--
ALTER TABLE `clothing`
  MODIFY `clothingId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `commentId` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `imageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5162;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shoes`
--
ALTER TABLE `shoes`
  MODIFY `shoesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clothing`
--
ALTER TABLE `clothing`
  ADD CONSTRAINT `clothing_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categoryclothing` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_shoes` FOREIGN KEY (`shoesId`) REFERENCES `shoes` (`shoesId`),
  ADD CONSTRAINT `fk_comments_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);

--
-- Constraints for table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`shoesId`) REFERENCES `shoes` (`shoesId`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`shoesId`) REFERENCES `shoes` (`shoesId`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`);

--
-- Constraints for table `shoes`
--
ALTER TABLE `shoes`
  ADD CONSTRAINT `shoes_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categoryshoes` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shoesize`
--
ALTER TABLE `shoesize`
  ADD CONSTRAINT `shoesize_ibfk_1` FOREIGN KEY (`shoesId`) REFERENCES `shoes` (`shoesId`),
  ADD CONSTRAINT `shoesize_ibfk_2` FOREIGN KEY (`sizeId`) REFERENCES `size` (`sizeId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
