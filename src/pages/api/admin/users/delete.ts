import db from "../../../../db";
import { user } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { id } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ message: "ID user tidak ditemukan" }), { status: 400 });
        }

        await db.delete(user).where(eq(user.id, id));

        return new Response(JSON.stringify({ message: "User berhasil dihapus" }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message || "Gagal menghapus user" }), { status: 500 });
    }
};
