import type { APIRoute } from 'astro';
import db from '../../../db';
import { santri, pendaftaran, pendidikanSebelumnya, alamat } from '../../../db/schema';
import { count, like, or, desc } from 'drizzle-orm';

// GET list pendaftar with pagination & search
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const offset = (page - 1) * pageSize;

    // Build query
    const baseQuery = db
      .select({
        id: santri.id,
        nisn: santri.nisn,
        namaLengkap: santri.namaLengkap,
        namaSekolah: pendidikanSebelumnya.namaSekolah,
        nomorHpOrangTua: alamat.nomorHpOrangTua,
        jenjangPendaftaran: pendaftaran.jenjangPendaftaran,
        kategoriPendaftaran: pendaftaran.kategoriPendaftaran,
        statusSantri: pendaftaran.statusSantri,
        createdAt: santri.createdAt,
      })
      .from(santri)
      .leftJoin(pendidikanSebelumnya, ({ eq }: any) => eq(pendidikanSebelumnya.santriId, santri.id))
      .leftJoin(alamat, ({ eq }: any) => eq(alamat.santriId, santri.id))
      .leftJoin(pendaftaran, ({ eq }: any) => eq(pendaftaran.santriId, santri.id))
      .orderBy(desc(santri.createdAt));

    // Get total count
    const totalResult = await db
      .select({ total: count() })
      .from(santri);
    const total = totalResult[0]?.total || 0;

    // Get paginated data
    const data = await baseQuery.limit(pageSize).offset(offset);

    return new Response(JSON.stringify({
      success: true,
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
