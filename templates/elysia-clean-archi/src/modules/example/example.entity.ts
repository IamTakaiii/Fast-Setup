import { t } from "elysia";
import { Static } from "@sinclair/typebox";

export const ExampleSchema = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.String(),
    createdAt: t.Date(),
});

export type Example = Static<typeof ExampleSchema>;
