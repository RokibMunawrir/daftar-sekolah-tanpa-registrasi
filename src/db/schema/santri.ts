import { mysqlTable, varchar, int, date, timestamp, text, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import * as master from './master';

// 1. SANTRI
export const santri = mysqlTable('santri', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  nis: varchar('nis', { length: 10 }).unique().notNull().$defaultFn(() => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(10000000 + Math.random() * 90000000).toString();
    return year + random;
  }),
  nisn: varchar('nisn', { length: 10 }).unique(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }).notNull(),
  tempatLahir: varchar('tempat_lahir', { length: 100 }).notNull(),
  tanggalLahir: date('tanggal_lahir').notNull(),
  jenisKelamin: mysqlEnum('jenis_kelamin', ['L', 'P']).notNull(),
  hobi: varchar('hobi', { length: 100 }),
  citaCita: varchar('cita_cita', { length: 100 }),
  anakKe: int('anak_ke').notNull(),
  beratBadan: int('berat_badan'),
  tinggiBadan: int('tinggi_badan'),
  jumlahSaudaraKandung: int('jumlah_saudara_kandung').default(0),
  jumlahSaudaraTiri: int('jumlah_saudara_tiri').default(0),
  statusKondisiSantri: varchar('status_kondisi_santri', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. ORANG TUA / WALI
export const orangTua = mysqlTable('orang_tua', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  tipe: mysqlEnum('tipe', ['AYAH', 'IBU', 'WALI']).notNull(),
  nama: varchar('nama', { length: 255 }).notNull(),
  nik: varchar('nik', { length: 16 }),
  tempatLahir: varchar('tempat_lahir', { length: 100 }),
  tanggalLahir: date('tanggal_lahir'),
  pendidikanId: varchar('pendidikan', { length: 100 }),
  pekerjaanId: varchar('pekerjaan', { length: 100 }),
  penghasilanId: varchar('penghasilan', { length: 100 }),
  kewarganegaraan: mysqlEnum('kewarganegaraan', ['WNI', 'WNA']).default('WNI'),
  hubunganWali: varchar('hubungan_wali', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. ALAMAT
export const alamat = mysqlTable('alamat', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  alamatLengkap: text('alamat_lengkap').notNull(),
  provinsiId: varchar('provinsi', { length: 100 }),
  kabupatenId: varchar('kabupaten', { length: 100 }),
  kecamatanId: varchar('kecamatan', { length: 100 }),
  desaKelurahanId: varchar('desa_kelurahan', { length: 100 }),
  rt: varchar('rt', { length: 5 }),
  rw: varchar('rw', { length: 5 }),
  kodepos: varchar('kodepos', { length: 10 }),
  nomorHpOrangTua: varchar('nomor_hp_orang_tua', { length: 20 }).notNull(),
  emailOrangTua: varchar('email_orang_tua', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. PENDIDIKAN SEBELUMNYA
export const pendidikanSebelumnya = mysqlTable('pendidikan_sebelumnya', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  npsnSekolahLama: varchar('npsn_sekolah_lama', { length: 8 }),
  nsmNss: varchar('nsm_nss', { length: 50 }),
  dariKelas: varchar('dari_kelas', { length: 10 }),
  namaSekolah: varchar('nama_sekolah', { length: 255 }).notNull(),
  noSkhun: varchar('no_skhun', { length: 50 }),
  noPesertaUjian: varchar('no_peserta_ujian', { length: 50 }),
  rataRataNilaiUn: varchar('rata_rata_nilai_un', { length: 10 }),
  noIjazah: varchar('no_ijazah', { length: 50 }),
  tahunLulus: varchar('tahun_lulus', { length: 4 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. BANTUAN SOSIAL
export const bantuanSosial = mysqlTable('bantuan_sosial', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  nomorKksKps: varchar('nomor_kks_kps', { length: 50 }),
  nomorPkh: varchar('nomor_pkh', { length: 50 }),
  nomorKip: varchar('nomor_kip', { length: 50 }),
  nomorBpjs: varchar('nomor_bpjs', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. PRESTASI
export const prestasi = mysqlTable('prestasi', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  cabangLomba: varchar('cabang_lomba', { length: 150 }).notNull(),
  tingkatId: varchar('tingkat', { length: 100 }),
  peringkatId: varchar('peringkat', { length: 100 }),
  tahunLomba: varchar('tahun_lomba', { length: 4 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. INFORMASI PENUNJANG
export const informasiPenunjang = mysqlTable('informasi_penunjang', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  organisasiMasyarakatId: varchar('organisasi_masyarakat', { length: 100 }),
  programBeasiswaId: varchar('program_beasiswa', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// RELATIONS
export const santriRelations = relations(santri, ({ one, many }) => ({
  orangTua: many(orangTua),
  alamat: one(alamat, { fields: [santri.id], references: [alamat.santriId] }),
  pendidikanSebelumnya: one(pendidikanSebelumnya, { fields: [santri.id], references: [pendidikanSebelumnya.santriId] }),
  bantuanSosial: one(bantuanSosial, { fields: [santri.id], references: [bantuanSosial.santriId] }),
  prestasi: many(prestasi),
  informasiPenunjang: one(informasiPenunjang, { fields: [santri.id], references: [informasiPenunjang.santriId] }),
}));
