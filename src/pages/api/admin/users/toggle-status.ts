import db from "../../../../db";
import { user } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { id, isActive } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ message: "ID user tidak ditemukan" }), { status: 400 });
        }

        await db.update(user)
            .set({ isActive })
            .where(eq(user.id, id));

        return new Response(JSON.stringify({ message: "Status user diperbarui" }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message || "Gagal memperbarui status user" }), { status: 500 });
    }
};
