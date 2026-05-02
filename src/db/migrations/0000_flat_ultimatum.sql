CREATE TABLE `desa_kelurahan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kecamatan_id` int,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `desa_kelurahan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kabupaten` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provinsi_id` int,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `kabupaten_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kecamatan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kabupaten_id` int,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `kecamatan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organisasi_masyarakat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `organisasi_masyarakat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pekerjaan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `pekerjaan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pendidikan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(50) NOT NULL,
	CONSTRAINT `pendidikan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penghasilan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rentang` varchar(100) NOT NULL,
	CONSTRAINT `penghasilan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestasi_peringkat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(50) NOT NULL,
	CONSTRAINT `prestasi_peringkat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestasi_tingkat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(50) NOT NULL,
	CONSTRAINT `prestasi_tingkat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `program_beasiswa` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `program_beasiswa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provinsi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(100) NOT NULL,
	CONSTRAINT `provinsi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alamat` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`alamat_lengkap` text NOT NULL,
	`provinsi` varchar(100),
	`kabupaten` varchar(100),
	`kecamatan` varchar(100),
	`desa_kelurahan` varchar(100),
	`rt` varchar(5),
	`rw` varchar(5),
	`kodepos` varchar(10),
	`nomor_hp_orang_tua` varchar(20) NOT NULL,
	`email_orang_tua` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alamat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bantuan_sosial` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`nomor_kks_kps` varchar(50),
	`nomor_pkh` varchar(50),
	`nomor_kip` varchar(50),
	`nomor_bpjs` varchar(50),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bantuan_sosial_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `informasi_penunjang` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`organisasi_masyarakat` varchar(100),
	`program_beasiswa` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `informasi_penunjang_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orang_tua` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`tipe` enum('AYAH','IBU','WALI') NOT NULL,
	`nama` varchar(255) NOT NULL,
	`nik` varchar(16),
	`tempat_lahir` varchar(100),
	`tanggal_lahir` date,
	`pendidikan` varchar(100),
	`pekerjaan` varchar(100),
	`penghasilan` varchar(100),
	`kewarganegaraan` enum('WNI','WNA') DEFAULT 'WNI',
	`hubungan_wali` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orang_tua_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pendidikan_sebelumnya` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`npsn_sekolah_lama` varchar(8),
	`nsm_nss` varchar(50),
	`dari_kelas` varchar(10),
	`nama_sekolah` varchar(255) NOT NULL,
	`no_skhun` varchar(50),
	`no_peserta_ujian` varchar(50),
	`rata_rata_nilai_un` varchar(10),
	`no_ijazah` varchar(50),
	`tahun_lulus` varchar(4),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pendidikan_sebelumnya_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prestasi` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`cabang_lomba` varchar(150) NOT NULL,
	`tingkat` varchar(100),
	`peringkat` varchar(100),
	`tahun_lomba` varchar(4),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prestasi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `santri` (
	`id` varchar(36) NOT NULL,
	`nisn` varchar(10),
	`nik` varchar(16) NOT NULL,
	`nama_lengkap` varchar(255) NOT NULL,
	`tempat_lahir` varchar(100) NOT NULL,
	`tanggal_lahir` date NOT NULL,
	`jenis_kelamin` enum('L','P') NOT NULL,
	`hobi` varchar(100),
	`cita_cita` varchar(100),
	`anak_ke` int NOT NULL,
	`berat_badan` int,
	`tinggi_badan` int,
	`jumlah_saudara_kandung` int DEFAULT 0,
	`jumlah_saudara_tiri` int DEFAULT 0,
	`status_kondisi_santri` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `santri_id` PRIMARY KEY(`id`),
	CONSTRAINT `santri_nisn_unique` UNIQUE(`nisn`),
	CONSTRAINT `santri_nik_unique` UNIQUE(`nik`)
);
--> statement-breakpoint
CREATE TABLE `pendaftaran` (
	`id` varchar(36) NOT NULL,
	`santri_id` varchar(36) NOT NULL,
	`jenjang_pendaftaran` varchar(50) NOT NULL,
	`kategori_pendaftaran` varchar(50) NOT NULL,
	`status_santri` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pendaftaran_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `desa_kelurahan` ADD CONSTRAINT `desa_kelurahan_kecamatan_id_kecamatan_id_fk` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kabupaten` ADD CONSTRAINT `kabupaten_provinsi_id_provinsi_id_fk` FOREIGN KEY (`provinsi_id`) REFERENCES `provinsi`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kecamatan` ADD CONSTRAINT `kecamatan_kabupaten_id_kabupaten_id_fk` FOREIGN KEY (`kabupaten_id`) REFERENCES `kabupaten`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alamat` ADD CONSTRAINT `alamat_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bantuan_sosial` ADD CONSTRAINT `bantuan_sosial_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `informasi_penunjang` ADD CONSTRAINT `informasi_penunjang_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orang_tua` ADD CONSTRAINT `orang_tua_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pendidikan_sebelumnya` ADD CONSTRAINT `pendidikan_sebelumnya_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prestasi` ADD CONSTRAINT `prestasi_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_santri_id_santri_id_fk` FOREIGN KEY (`santri_id`) REFERENCES `santri`(`id`) ON DELETE cascade ON UPDATE no action;