import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { pgDb } from "@data/postgres";
import { ac, user, moderator, admin as adminRole } from "@shared/auth/auth.perm";
import { isProduction } from "@config/env";

export const auth = betterAuth({
    basePath: "/auth/api",
    database: drizzleAdapter(pgDb, {
        provider: "pg",
    }),
    trustedOrigins: (request) => {
        const origin = request?.headers.get("origin");
        if (!origin) return [];

        if (isProduction) {
            if (origin.endsWith(".takai.site")) {
                return [origin];
            }
        }

        return [origin];
    },
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: "uuid",
        }
    },
    plugins: [
        openAPI(),
        admin({
            defaultRole: "user",
            adminRoles: ["admin"],
            ac: {
                ...ac,
                user,
                moderator,
                admin: adminRole,
            },
        }),
    ],
});

export type Session = typeof auth.$Infer.Session;
