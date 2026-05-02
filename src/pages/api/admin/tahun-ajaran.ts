import type { APIRoute } from 'astro';
import db from '../../../db';
import { tahunAjaran } from '../../../db/schema';
import { eq } from 'drizzle-orm';

// GET all tahun ajaran
export const GET: APIRoute = async () => {
  try {
    const rows = await db.select().from(tahunAjaran).orderBy(tahunAjaran.tahun);
    return new Response(JSON.stringify({ success: true, data: rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

// POST add tahun ajaran
export const POST: APIRoute = async ({ request }) => {
  try {
    const { tahun } = await request.json();
    await db.insert(tahunAjaran).values({ tahun, isActive: 0, isOpenPpdb: 0, kuota: 350 });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

// PUT update tahun ajaran (e.g. toggle PPDB, set active)
export const PUT: APIRoute = async ({ request }) => {
  try {
    const { id, action, value } = await request.json();
    
    if (action === 'set-active') {
      // Unset all active first
      await db.update(tahunAjaran).set({ isActive: 0 });
      await db.update(tahunAjaran).set({ isActive: 1 }).where(eq(tahunAjaran.id, id));
    } else if (action === 'toggle-ppdb') {
      await db.update(tahunAjaran).set({ isOpenPpdb: value ? 1 : 0 }).where(eq(tahunAjaran.id, id));
    } else if (action === 'update-kuota') {
      await db.update(tahunAjaran).set({ kuota: value }).where(eq(tahunAjaran.id, id));
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

// DELETE tahun ajaran
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    await db.delete(tahunAjaran).where(eq(tahunAjaran.id, id));
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
