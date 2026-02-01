import { Elysia } from "elysia";
import { v1Routes } from "./v1";
import { v2Routes } from "./v2";

export const apiRoutes = new Elysia({ prefix: "/api" }).use(v1Routes).use(v2Routes);
