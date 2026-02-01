import "reflect-metadata";
import "./config/env";
import "./config/di-container";
import "@shared/i18n/i18n.config";
import { Elysia } from "elysia";
import {
    corsPlugin,
    helmetPlugin,
    openapiInternalPlugin,
    createOpenapiPublicPlugin,
    loggerPlugin,
    authPlugin,
} from "./config/plugins";
import { handleError } from "@shared/errors/error.middleware";
import { apiRoutes } from "./api";
import { env } from "./config/env";
import { healthRoutes } from "@modules/health/health.controller";

const app = new Elysia()
    .onError(handleError)
    .use(corsPlugin)
    .use(helmetPlugin)
    .use(loggerPlugin)
    .use(authPlugin)
    .use(apiRoutes)
    .use(healthRoutes)
    .use(openapiInternalPlugin)
    .use(createOpenapiPublicPlugin())
    .listen(env.PORT);

console.log(`🦊 Server is running at http://localhost:${env.PORT}`);
console.log(`📝 Environment: ${env.NODE_ENV}`);
console.log(`📚 API Documentation:`);
console.log(`   Internal: http://localhost:${env.PORT}/internal`);
console.log(`   Public:   http://localhost:${env.PORT}/public`);
console.log(`\n📌 API Endpoints:`);
console.log(`   v1 (Development): http://localhost:${env.PORT}/api/v1`);
console.log(`   v2 (Development): http://localhost:${env.PORT}/api/v2`);
console.log(`\n💡 Note: Internal docs show all endpoints, Public docs show only public endpoints`);

export type App = typeof app;
