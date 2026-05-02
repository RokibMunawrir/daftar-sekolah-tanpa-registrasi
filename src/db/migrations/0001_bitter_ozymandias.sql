CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `tahun_ajaran` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tahun` varchar(20) NOT NULL,
	`is_active` tinyint NOT NULL DEFAULT 0,
	`is_open_ppdb` tinyint NOT NULL DEFAULT 0,
	`kuota` int DEFAULT 350,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tahun_ajaran_id` PRIMARY KEY(`id`),
	CONSTRAINT `tahun_ajaran_tahun_unique` UNIQUE(`tahun`)
);
