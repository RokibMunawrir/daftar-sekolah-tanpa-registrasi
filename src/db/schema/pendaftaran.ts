import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { santri } from './santri';

export const pendaftaran = mysqlTable('pendaftaran', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  santriId: varchar('santri_id', { length: 36 }).references(() => santri.id, { onDelete: 'cascade' }).notNull(),
  jenjangPendaftaran: varchar('jenjang_pendaftaran', { length: 50 }).notNull(),
  kategoriPendaftaran: varchar('kategori_pendaftaran', { length: 50 }).notNull(),
  statusSantri: varchar('status_santri', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pendaftaranRelations = relations(pendaftaran, ({ one }) => ({
  santri: one(santri, { fields: [pendaftaran.santriId], references: [santri.id] }),
}));
