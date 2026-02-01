import { Elysia } from "elysia";
import { openApiRegistry } from "@shared/openapi/openapi.registry";

// Register tag นี้เป็น internal (จะไม่แสดงใน public docs)
openApiRegistry.registerInternalTag("Health");

export const healthRoutes = new Elysia({ prefix: "/health" })
    .get(
        "/",
        () => ({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        }),
        {
            detail: {
                tags: ["Health"],
                summary: "Health check",
                description: "Check if the API is running",
            },
        },
    )
    .get(
        "/ready",
        () => ({
            status: "ready",
            timestamp: new Date().toISOString(),
        }),
        {
            detail: {
                tags: ["Health"],
                summary: "Readiness check",
                description: "Check if the API is ready to accept requests",
            },
        },
    )
    .get(
        "/live",
        () => ({
            status: "alive",
            timestamp: new Date().toISOString(),
        }),
        {
            detail: {
                tags: ["Health"],
                summary: "Liveness check",
                description: "Check if the API is alive",
            },
        },
    );
