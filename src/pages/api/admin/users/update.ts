import db from "../../../../db";
import { user } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";
import { auth } from "../../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { id, name, email, role, password } = body;

        if (!id || !name || !email) {
            return new Response(JSON.stringify({ message: "Data tidak lengkap" }), { status: 400 });
        }

        // 1. Update Password if provided
        if (password) {
            try {
                // Use admin API to set password
                // Note: setUserPassword is the correct method name in Better Auth 1.x server API
                await (auth.api as any).setUserPassword({
                    body: {
                        userId: id,
                        newPassword: password
                    },
                    headers: request.headers
                });
            } catch (authError: any) {
                console.error("Auth update error:", authError);
                return new Response(JSON.stringify({ message: "Gagal memperbarui password: " + authError.message }), { status: 500 });
            }
        }

        // 2. Check if email already exists for another user
        const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
        if (existingUser.length > 0 && existingUser[0].id !== id) {
            return new Response(JSON.stringify({ message: "Email sudah digunakan oleh user lain" }), { status: 400 });
        }

        // 3. Update User metadata
        await db.update(user)
            .set({ 
                name, 
                email, 
                role,
                updatedAt: new Date()
            })
            .where(eq(user.id, id));

        return new Response(JSON.stringify({ 
            message: "User berhasil diperbarui",
            user: { id, name, email, role } 
        }), { status: 200 });

    } catch (error: any) {
        console.error("Update user error:", error);
        return new Response(JSON.stringify({ 
            message: error.message || "Gagal memperbarui user" 
        }), { status: 500 });
    }
};
