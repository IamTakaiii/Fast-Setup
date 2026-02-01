import { Elysia, type Context } from "elysia";
import { auth } from "@shared/auth/auth";
import { ForbiddenError, UnauthorizedError } from "@shared/errors/app-error";
import type { Statement, Role } from "@shared/auth/auth.perm";

const getSession = async (headers: Headers) => {
    const session = await auth.api.getSession({ headers });
    return session ? { user: session.user, session: session.session } : null;
};

const createAuthResolver = (required: boolean) => ({
    async resolve({ request: { headers }, status }: Context) {
        const result = await getSession(headers);

        if (!result && required) {
            throw new UnauthorizedError("errors.unauthorized");
        }

        return result ?? { user: null, session: null };
    },
});

const createRoleResolver = (allowedRoles: Role[]) => ({
    async resolve({ request: { headers }, status }: Context) {
        const result = await getSession(headers);

        if (!result) {
            throw new UnauthorizedError("errors.unauthorized");
        }

        const userRole = (result.user as { role?: string }).role || "user";

        if (!allowedRoles.includes(userRole as Role)) {
            throw new ForbiddenError("errors.forbidden");
        }

        return result;
    },
});

type PermissionCheck = {
    [K in keyof Statement]?: Array<Statement[K][number]>;
};

const createPermissionResolver = (permissions: PermissionCheck) => ({
    async resolve({ request: { headers }, status }: Context) {
        const result = await getSession(headers);

        if (!result) {
            throw new UnauthorizedError("errors.unauthorized");
        }

        // Use better-auth's hasPermission API
        const hasPermission = await auth.api.userHasPermission({
            body: {
                userId: result.user.id,
                permissions,
            },
        });

        if (!hasPermission.success) {
            throw new ForbiddenError("errors.forbidden");
        }

        return result;
    },
});

export const authMiddleware = new Elysia({ name: "auth" }).macro({
    guard: createAuthResolver(true),
    optionalGuard: createAuthResolver(false),
    role: (roles: Role | Role[]) => createRoleResolver(Array.isArray(roles) ? roles : [roles]),
    permission: (permissions: PermissionCheck) => createPermissionResolver(permissions),
});
