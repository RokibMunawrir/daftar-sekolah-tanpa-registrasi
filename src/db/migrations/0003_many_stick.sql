ALTER TABLE `santri` ADD `nis` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `role` varchar(50) DEFAULT 'Admin';--> statement-breakpoint
ALTER TABLE `user` ADD `is_active` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `santri` ADD CONSTRAINT `santri_nis_unique` UNIQUE(`nis`);