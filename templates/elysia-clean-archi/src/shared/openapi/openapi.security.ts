export type SecurityRequirement = {
    type: "auth" | "permission" | "role";
    value?: string | string[];
};

export const Security = {
    auth: (): SecurityRequirement => ({
        type: "auth",
    }),

    permission: (value: string | string[]): SecurityRequirement => ({
        type: "permission",
        value,
    }),

    role: (value: string | string[]): SecurityRequirement => ({
        type: "role",
        value,
    }),
};


export const formatSecurityRequirement = (requirement: SecurityRequirement): string => {
    switch (requirement.type) {
        case "auth":
            return "🔒 Authentication required";
        case "permission":
            const permissions = Array.isArray(requirement.value)
                ? requirement.value.join(", ")
                : requirement.value;
            return `🔐 Permission: ${permissions}`;
        case "role":
            const roles = Array.isArray(requirement.value) ? requirement.value.join(", ") : requirement.value;
            return `👤 Role: ${roles}`;
    }
};


export const createSecureDetail = (
    summary: string,
    description: string,
    security: SecurityRequirement,
    operationId?: string,
) => {
    const securityNote = formatSecurityRequirement(security);
    return {
        operationId,
        summary,
        description: `${description}\n\n${securityNote}`,
    };
};
