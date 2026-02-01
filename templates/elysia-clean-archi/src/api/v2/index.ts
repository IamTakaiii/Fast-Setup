import { Elysia } from "elysia";
import { healthRoutes } from "@modules/health/health.controller";
// Import v2 modules here when ready

export const v2Routes = new Elysia({ prefix: "/v2" });
// Add v2 routes here
