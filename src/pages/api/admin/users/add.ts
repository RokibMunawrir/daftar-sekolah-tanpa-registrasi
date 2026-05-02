import { auth } from "../../../../lib/auth";
import db from "../../../../db";
import { user } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: "Data tidak lengkap" }), { status: 400 });
        }

        // 1. Create user via better-auth
        const result = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        if (!result) {
            throw new Error("Gagal membuat user");
        }

        // 2. Update role (better-auth defaults to standard user)
        if (role) {
            await db.update(user)
                .set({ role })
                .where(eq(user.email, email));
        }

        return new Response(JSON.stringify({ 
            message: "User berhasil ditambahkan",
            user: { name, email, role } 
        }), { status: 201 });

    } catch (error: any) {
        console.error("Add user error:", error);
        return new Response(JSON.stringify({ 
            message: error.message || "Gagal menambahkan user" 
        }), { status: 500 });
    }
};
