import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    example: ["create", "read", "update", "delete"],
    project: ["create", "read", "update", "delete", "share"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    example: ["read"],
    project: ["read"],
});

export const moderator = ac.newRole({
    example: ["create", "read", "update"],
    project: ["create", "read", "update"],
    user: ["list"],
});

export const admin = ac.newRole({
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    example: ["create", "read", "update", "delete"],
    project: ["create", "read", "update", "delete", "share"],
});

export type Statement = typeof statement;
export type Role = "user" | "moderator" | "admin";
