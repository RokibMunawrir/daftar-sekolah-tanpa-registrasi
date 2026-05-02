import type { APIRoute } from 'astro';
import db from '../../../db';
import { santri, pendaftaran, tahunAjaran } from '../../../db/schema';
import { count, eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    // Total pendaftar
    const [totalRow] = await db.select({ total: count() }).from(santri);
    const totalPendaftar = totalRow?.total || 0;

    // Pendaftar per status
    const [totalBaru] = await db.select({ total: count() }).from(pendaftaran).where(eq(pendaftaran.statusSantri, 'Baru'));
    const [totalPindahan] = await db.select({ total: count() }).from(pendaftaran).where(eq(pendaftaran.statusSantri, 'Pindahan'));

    // Pendaftar terbaru (5 terakhir)
    const recentData = await db
      .select({
        id: santri.id,
        namaLengkap: santri.namaLengkap,
        jenjangPendaftaran: pendaftaran.jenjangPendaftaran,
        statusSantri: pendaftaran.statusSantri,
        createdAt: santri.createdAt,
      })
      .from(santri)
      .leftJoin(pendaftaran, eq(pendaftaran.santriId, santri.id))
      .orderBy(santri.createdAt)
      .limit(5);

    // Tahun ajaran aktif & ppdb
    const activeTahun = await db.select().from(tahunAjaran).where(eq(tahunAjaran.isActive, 1)).limit(1);
    const ppdbTahun = await db.select().from(tahunAjaran).where(eq(tahunAjaran.isOpenPpdb, 1)).limit(1);

    return new Response(JSON.stringify({
      success: true,
      stats: {
        totalPendaftar,
        totalBaru: totalBaru?.total || 0,
        totalPindahan: totalPindahan?.total || 0,
      },
      recentPendaftar: recentData,
      activeTahunAjaran: activeTahun[0] || null,
      ppdbOpenTahun: ppdbTahun[0] || null,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
