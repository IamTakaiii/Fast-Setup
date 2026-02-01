import { Elysia } from "elysia";
import { exampleRoutes } from "@modules/example/example.controller";

export const v1Routes = new Elysia({ prefix: "/v1" }).use(exampleRoutes);
