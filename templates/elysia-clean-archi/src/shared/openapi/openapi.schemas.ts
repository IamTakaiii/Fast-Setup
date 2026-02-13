import { t, type TSchema } from "elysia";

/**
 * Common parameter schemas for OpenAPI documentation
 * These schemas are reusable across different modules to reduce duplication
 */

// ============================================================================
// PARAMETER SCHEMAS
// ============================================================================

/**
 * UUID parameter schema for single ID routes
 * Usage: params: UuidParamSchema
 */
export const UuidParamSchema = t.Object({
    id: t.String({ format: "uuid" }),
});

/**
 * UUID parameter schema for routes with conversationId
 * Usage: params: ConversationIdParamSchema
 */
export const ConversationIdParamSchema = t.Object({
    conversationId: t.String({ format: "uuid" }),
});

/**
 * UUID parameter schema for routes with contactId
 * Usage: params: ContactIdParamSchema
 */
export const ContactIdParamSchema = t.Object({
    contactId: t.String({ format: "uuid" }),
});

/**
 * UUID parameter schema for routes with slug
 * Usage: params: SlugParamSchema
 */
export const SlugParamSchema = t.Object({
    slug: t.String(),
});

/**
 * UUID parameter schema for routes with featureId
 * Usage: params: FeatureIdParamSchema
 */
export const FeatureIdParamSchema = t.Object({
    featureId: t.String({ format: "uuid" }),
});

// ============================================================================
// QUERY PARAMETER SCHEMAS
// ============================================================================

/**
 * Common pagination query schema
 * Usage: query: PaginationQuerySchema
 */
export const PaginationQuerySchema = t.Object({
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
    offset: t.Optional(t.Number({ minimum: 0, default: 0 })),
});

/**
 * Pagination query with search
 * Usage: query: PaginationWithSearchQuerySchema
 */
export const PaginationWithSearchQuerySchema = t.Object({
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
    offset: t.Optional(t.Number({ minimum: 0, default: 0 })),
    search: t.Optional(t.String()),
});

/**
 * Date range query schema
 * Usage: query: DateRangeQuerySchema
 */
export const DateRangeQuerySchema = t.Object({
    startDate: t.Optional(t.String({ format: "date-time" })),
    endDate: t.Optional(t.String({ format: "date-time" })),
});

/**
 * Sort query schema
 * Usage: query: SortQuerySchema
 */
export const SortQuerySchema = t.Object({
    sortBy: t.Optional(t.String()),
    sortOrder: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")], { default: "asc" })),
});

/**
 * Filter by status query schema
 * Usage: query: StatusFilterQuerySchema
 */
export const StatusFilterQuerySchema = t.Object({
    status: t.Optional(t.String()),
});

/**
 * Filter by organization query schema
 * Usage: query: OrganizationFilterQuerySchema
 */
export const OrganizationFilterQuerySchema = t.Object({
    organizationId: t.Optional(t.String({ format: "uuid" })),
});

/**
 * Filter by workspace query schema
 * Usage: query: WorkspaceFilterQuerySchema
 */
export const WorkspaceFilterQuerySchema = t.Object({
    workspaceId: t.Optional(t.String({ format: "uuid" })),
});

/**
 * Boolean filter query schema
 * Usage: query: BooleanFilterQuerySchema("isActive")
 */
export const createBooleanFilterQuerySchema = (fieldName: string) =>
    t.Object({
        [fieldName]: t.Optional(t.Boolean()),
    });

// ============================================================================
// SCHEMA COMPOSITION UTILITIES
// ============================================================================

/**
 * Compose multiple query schemas into one
 * Usage: composeQuerySchemas(PaginationQuerySchema, DateRangeQuerySchema, SortQuerySchema)
 */
export const composeQuerySchemas = <T extends TSchema[]>(...schemas: T) => {
    const properties = schemas.reduce(
        (acc, schema) => {
            if ("properties" in schema) {
                return { ...acc, ...schema.properties };
            }
            return acc;
        },
        {} as Record<string, TSchema>,
    );

    return t.Object(properties);
};

/**
 * Create a paginated query schema with additional filters
 * Usage: createPaginatedQuerySchema({ search: t.Optional(t.String()), status: t.Optional(t.String()) })
 */
export const createPaginatedQuerySchema = (additionalFields: Record<string, TSchema> = {}) => {
    return t.Object({
        ...PaginationQuerySchema.properties,
        ...additionalFields,
    });
};

/**
 * Create a filtered query schema with common filters
 * Usage: createFilteredQuerySchema({ customField: t.Optional(t.String()) })
 */
export const createFilteredQuerySchema = (additionalFields: Record<string, TSchema> = {}) => {
    return t.Object({
        ...PaginationQuerySchema.properties,
        search: t.Optional(t.String()),
        ...DateRangeQuerySchema.properties,
        ...SortQuerySchema.properties,
        ...additionalFields,
    });
};

/**
 * Add optional UUID field to existing schema
 * Usage: withOptionalUuid(BaseSchema, "userId")
 */
export const withOptionalUuid = <T extends TSchema>(schema: T, fieldName: string) => {
    if ("properties" in schema) {
        return t.Object({
            ...schema.properties,
            [fieldName]: t.Optional(t.String({ format: "uuid" })),
        });
    }
    return schema;
};

/**
 * Make all fields in a schema optional
 * Usage: makeOptional(RequiredSchema)
 */
export const makeOptional = <T extends TSchema>(schema: T) => {
    if ("properties" in schema) {
        const optionalProperties = Object.entries(schema.properties).reduce(
            (acc, [key, value]) => {
                acc[key] = t.Optional(value as TSchema);
                return acc;
            },
            {} as Record<string, TSchema>,
        );
        return t.Object(optionalProperties);
    }
    return schema;
};

// ============================================================================
// COMMON FIELD SCHEMAS
// ============================================================================

/**
 * Common timestamp fields
 */
export const TimestampFields = {
    createdAt: t.String({ format: "date-time" }),
    updatedAt: t.String({ format: "date-time" }),
};

/**
 * Common soft delete field
 */
export const SoftDeleteField = {
    deletedAt: t.Nullable(t.String({ format: "date-time" })),
};

/**
 * Common UUID ID field
 */
export const UuidIdField = {
    id: t.String({ format: "uuid" }),
};

/**
 * Create a schema with timestamp fields
 * Usage: withTimestamps(YourSchema)
 */
export const withTimestamps = <T extends TSchema>(schema: T) => {
    if ("properties" in schema) {
        return t.Object({
            ...schema.properties,
            ...TimestampFields,
        });
    }
    return schema;
};

/**
 * Create a schema with soft delete field
 * Usage: withSoftDelete(YourSchema)
 */
export const withSoftDelete = <T extends TSchema>(schema: T) => {
    if ("properties" in schema) {
        return t.Object({
            ...schema.properties,
            ...SoftDeleteField,
        });
    }
    return schema;
};
