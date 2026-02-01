import { Elysia } from "elysia";
import { container } from "@shared/di";
import { GetExampleUseCase } from "@modules/example/example.usecase";
import { ApiResponse } from "@shared/response/response.util";
import { i18nMiddleware } from "@shared/i18n/i18n.middleware";
import { authMiddleware } from "@shared/auth/auth.middleware";
import { exampleDocs } from "@modules/example/example.docs";
import { openApiRegistry } from "@shared/openapi/openapi.registry";

openApiRegistry.registerInternalTag("Example Version 01");

export const exampleRoutes = new Elysia({ prefix: "/example", tags: ["Example Version 01"] })
    .use(i18nMiddleware)
    .use(authMiddleware)

    // Public endpoint - แสดงใน public OpenAPI
    .get(
        "/public",
        async ({ lng }) => {
            const useCase = container.resolve(GetExampleUseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "success", lng);
        },
        exampleDocs.getAll,
    )

    // Optional auth
    .get(
        "/optional",
        async ({ lng }) => {
            const useCase = container.resolve(GetExampleUseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "success", lng);
        },
        { ...exampleDocs.getAll, optionalGuard: true },
    )

    // Protected endpoint - ต้อง login (Internal only)
    .get(
        "/protected",
        async ({ lng }) => {
            const useCase = container.resolve(GetExampleUseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "success", lng);
        },
        { ...exampleDocs.getAll, guard: true },
    )

    // Role-based - เฉพาะ admin และ moderator (Internal only)
    .get(
        "/moderator-only",
        async ({ lng }) => {
            const useCase = container.resolve(GetExampleUseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "success", lng);
        },
        { ...exampleDocs.getAll, role: ["admin", "moderator"] },
    )

    // Permission-based - ต้องมี permission example:create (Internal only)
    .post(
        "/",
        async ({ lng }) => {
            const useCase = container.resolve(GetExampleUseCase);
            const data = await useCase.execute();
            return ApiResponse.success(data, "created", lng);
        },
        {
            ...exampleDocs.getAll,
            permission: { example: ["create"] },
        },
    )

    // Admin only - ต้องมี role admin (Internal only)
    .delete(
        "/:id",
        async ({ lng, params }) => {
            return ApiResponse.success({ id: params.id }, "deleted", lng);
        },
        {
            role: "admin",
            detail: {
                summary: "Delete example",
                description: "Delete an example by ID (Admin only)",
            },
        },
    );
