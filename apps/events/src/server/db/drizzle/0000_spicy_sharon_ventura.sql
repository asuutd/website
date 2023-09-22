-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Account` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	CONSTRAINT `Account_id` PRIMARY KEY(`id`),
	CONSTRAINT `Account_provider_providerAccountId_key` UNIQUE(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `Code` (
	`id` varchar(191) NOT NULL,
	`code` varchar(191) NOT NULL,
	`tierId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`value` double NOT NULL,
	`limit` int NOT NULL,
	CONSTRAINT `Code_id` PRIMARY KEY(`id`),
	CONSTRAINT `Code_code_tierId_key` UNIQUE(`code`,`tierId`)
);
--> statement-breakpoint
CREATE TABLE `Event` (
	`id` varchar(191) NOT NULL,
	`start` datetime(3) NOT NULL,
	`end` datetime(3) NOT NULL,
	`name` varchar(191) NOT NULL,
	`image` varchar(191),
	`ref_quantity` int,
	`organizerId` varchar(191),
	`ticketImage` varchar(191),
	`description` text,
	`fee_holder` enum('USER','ORGANIZER'),
	CONSTRAINT `Event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `EventAdmin` (
	`id` varchar(191) NOT NULL,
	`eventId` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `EventAdmin_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `EventLocation` (
	`id` varchar(191) NOT NULL,
	`long` double NOT NULL,
	`lat` double NOT NULL,
	`name` varchar(191),
	CONSTRAINT `EventLocation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Example` (
	`id` varchar(191) NOT NULL,
	CONSTRAINT `Example_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Organizer` (
	`id` varchar(191) NOT NULL,
	`stripeAccountId` varchar(191),
	CONSTRAINT `Organizer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `RefCode` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`eventId` varchar(191) NOT NULL,
	CONSTRAINT `RefCode_id` PRIMARY KEY(`id`),
	CONSTRAINT `RefCode_userId_eventId_key` UNIQUE(`userId`,`eventId`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`),
	CONSTRAINT `Session_sessionToken_key` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `Ticket` (
	`id` varchar(191) NOT NULL,
	`codeId` varchar(191),
	`tierId` varchar(191),
	`eventId` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`refCodeId` int,
	`checkedInAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`paymentIntent` varchar(191),
	CONSTRAINT `Ticket_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Tier` (
	`id` varchar(191) NOT NULL,
	`price` double NOT NULL,
	`start` datetime(3) NOT NULL,
	`end` datetime(3) NOT NULL,
	`eventId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`limit` int,
	CONSTRAINT `Tier_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`emailVerified` datetime(3),
	`image` varchar(191),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_key` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `VerificationToken_identifier_token_key` UNIQUE(`identifier`,`token`),
	CONSTRAINT `VerificationToken_token_key` UNIQUE(`token`)
);

*/