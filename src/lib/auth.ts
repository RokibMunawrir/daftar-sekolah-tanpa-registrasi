import { betterAuth } from "better-auth";
import { admin, createAccessControl } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db  from "../db"; 
import * as schema from "../db/schema";

const ac = createAccessControl({
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"],
    session: ["list", "revoke", "delete"]
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [
        admin({
            roles: {
                "Super Admin": ac.newRole({
                    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"],
                    session: ["list", "revoke", "delete"]
                }),
                "Panitia PPDB": ac.newRole({
                    user: ["list", "get"],
                    session: []
                }),
                "Tata Usaha": ac.newRole({
                    user: ["list", "get"],
                    session: []
                })
            },
            adminRoles: ["Super Admin"]
        })
    ]
});