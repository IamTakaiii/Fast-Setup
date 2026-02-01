import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "@shared/auth/auth";
import { authOpenAPI } from "@shared/auth/auth.docs";
import { openApiRegistry } from "@shared/openapi/openapi.registry";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { logger } from "elysia-logger";
import { env, isProduction } from "./env";

export const corsPlugin = cors({
    origin: (request) => {
        const origin = request.headers.get("origin");
        if (!origin) return false;
        
        if (env.CORS_ORIGIN === "*") {
            return true;
        }
        
        const allowedOrigins = env.CORS_ORIGIN.split(",").map(o => o.trim());
        return allowedOrigins.includes(origin);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

export const helmetPlugin = helmet({
    contentSecurityPolicy: isProduction,
});

// OpenAPI สำหรับ Internal Use (ทุก endpoints) - Protected with Basic Auth in index.ts
export const openapiInternalPlugin = openapi({
    path: "/internal",
    documentation: {
        info: {
            title: "Internal API Documentation",
            version: "1.0.0",
            description: "Complete API documentation for internal use (Protected)",
        },
        components: await authOpenAPI.components,
        paths: await authOpenAPI.getPaths(),
    },
});

// OpenAPI สำหรับ Third Party (เฉพาะ endpoints ที่ต้องการ)
// Tags ที่ถูก register เป็น internal จะถูก exclude อัตโนมัติ
// ใช้ function เพื่อให้ getInternalTags() ถูกเรียกหลังจาก controllers ถูก import แล้ว
export const createOpenapiPublicPlugin = () =>
    openapi({
        path: "/public",
        documentation: {
            info: {
                title: "Public API Documentation",
                version: "1.0.0",
                description: "Public API documentation for third-party integrations",
            },
        },
        exclude: {
            paths: [
                "/internal/swagger",
                "/internal/docs",
                "/internal/openapi.json",
                "/internal/openapi.yaml",
            ],
            tags: openApiRegistry.getInternalTags(),
        },
    });

// Backward compatibility - ใช้ internal เป็น default
export const openapiPlugin = openapiInternalPlugin;

export const loggerPlugin = logger({
    autoLogging: true,
});

export const authPlugin = new Elysia({ name: "auth-handler" }).mount("", auth.handler);
