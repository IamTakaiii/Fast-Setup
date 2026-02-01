import type { Context } from "elysia";
import { env } from "@config/env";

/**
 * Parse Basic Auth header
 */
function parseBasicAuth(authHeader: string | null): { username: string; password: string } | null {
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return null;
    }

    try {
        const base64Credentials = authHeader.slice(6);
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");

        if (!username || !password) {
            return null;
        }

        return { username, password };
    } catch {
        return null;
    }
}

/**
 * Verify credentials
 */
function verifyCredentials(username: string, password: string): boolean {
    return username === env.INTERNAL_DOCS_USERNAME && password === env.INTERNAL_DOCS_PASSWORD;
}

/**
 * Basic Auth guard for protecting internal routes
 */
export function basicAuthGuard({ path, request, set }: Context) {
    if (!path.startsWith("/internal")) {
        return;
    }

    const authHeader = request.headers.get("authorization");
    const credentials = parseBasicAuth(authHeader);
    const isAuthenticated = credentials ? verifyCredentials(credentials.username, credentials.password) : false;

    if (!isAuthenticated) {
        set.status = 401;
        set.headers["WWW-Authenticate"] = 'Basic realm="Internal Documentation", charset="UTF-8"';
        return {
            error: "Unauthorized",
            message: "Authentication required to access internal documentation",
        };
    }
}
