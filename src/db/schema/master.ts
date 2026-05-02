import { mysqlTable, int, varchar, timestamp, text, tinyint } from 'drizzle-orm/mysql-core';

// Wilayah
export const provinsi = mysqlTable('provinsi', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 100 }).notNull(),
});

export const kabupaten = mysqlTable('kabupaten', {
  id: int('id').primaryKey().autoincrement(),
  provinsiId: int('provinsi_id').references(() => provinsi.id),
  nama: varchar('nama', { length: 100 }).notNull(),
});

export const kecamatan = mysqlTable('kecamatan', {
  id: int('id').primaryKey().autoincrement(),
  kabupatenId: int('kabupaten_id').references(() => kabupaten.id),
  nama: varchar('nama', { length: 100 }).notNull(),
});

export const desaKelurahan = mysqlTable('desa_kelurahan', {
  id: int('id').primaryKey().autoincrement(),
  kecamatanId: int('kecamatan_id').references(() => kecamatan.id),
  nama: varchar('nama', { length: 100 }).notNull(),
});

// Sosial Ekonomi & Umum
export const pendidikan = mysqlTable('pendidikan', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 50 }).notNull(),
});

export const pekerjaan = mysqlTable('pekerjaan', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 100 }).notNull(),
});

export const penghasilan = mysqlTable('penghasilan', {
  id: int('id').primaryKey().autoincrement(),
  rentang: varchar('rentang', { length: 100 }).notNull(),
});

export const organisasiMasyarakat = mysqlTable('organisasi_masyarakat', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 100 }).notNull(),
});

export const programBeasiswa = mysqlTable('program_beasiswa', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 100 }).notNull(),
});

// Prestasi
export const prestasiTingkat = mysqlTable('prestasi_tingkat', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 50 }).notNull(),
});

export const prestasiPeringkat = mysqlTable('prestasi_peringkat', {
  id: int('id').primaryKey().autoincrement(),
  nama: varchar('nama', { length: 50 }).notNull(),
});

// Settings (key-value store)
export const settings = mysqlTable('settings', {
  id: int('id').primaryKey().autoincrement(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tahun Ajaran
export const tahunAjaran = mysqlTable('tahun_ajaran', {
  id: int('id').primaryKey().autoincrement(),
  tahun: varchar('tahun', { length: 20 }).notNull().unique(),
  isActive: tinyint('is_active').default(0).notNull(),
  isOpenPpdb: tinyint('is_open_ppdb').default(0).notNull(),
  kuota: int('kuota').default(350),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
