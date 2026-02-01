import { Elysia } from "elysia";

export const i18nMiddleware = (app: Elysia) =>
    app.derive(({ request }) => {
        const lng = request.headers.get("accept-language")?.split(",")[0] || "en";
        return { lng };
    });
