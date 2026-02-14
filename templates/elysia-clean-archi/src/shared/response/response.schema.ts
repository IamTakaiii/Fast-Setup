import { type TSchema, t } from "elysia";

export const PaginationMetaSchema = t.Object({
    total: t.Number({ minimum: 0, description: "Total number of items" }),
    limit: t.Number({ minimum: 1, description: "Number of items per page" }),
    offset: t.Number({ minimum: 0, description: "Current offset" }),
    hasMore: t.Boolean({ description: "Whether there are more items" }),
});

export const successResponseSchema = <T extends TSchema>(dataSchema: T) =>
    t.Object({
        success: t.Boolean({ default: true }),
        message: t.String(),
        data: t.Optional(dataSchema),
        meta: t.Optional(t.Any()),
    });

export const successResponseWithPaginationSchema = <T extends TSchema>(dataSchema: T) =>
    t.Object({
        success: t.Boolean({ default: true }),
        message: t.String(),
        data: t.Optional(dataSchema),
        meta: t.Optional(PaginationMetaSchema),
    });

export const errorResponseSchema = (code: string, message: string) =>
    t.Object({
        success: t.Boolean({ default: false }),
        message: t.String({ default: message }),
        error: t.Optional(
            t.Object({
                code: t.String({ default: code }),
                details: t.Optional(t.Any()),
            }),
        ),
    });

export const ErrorSchemas = {
    badRequest: errorResponseSchema("BAD_REQUEST", "Bad request"),
    unauthorized: errorResponseSchema("UNAUTHORIZED", "Unauthorized"),
    forbidden: errorResponseSchema("FORBIDDEN", "Forbidden"),
    notFound: errorResponseSchema("NOT_FOUND", "Resource not found"),
    conflict: errorResponseSchema("CONFLICT", "Resource conflict"),
    validation: errorResponseSchema("VALIDATION_ERROR", "Validation failed"),
    internal: errorResponseSchema("INTERNAL_ERROR", "Internal server error"),
};

const defaultErrorResponses = {
    400: ErrorSchemas.badRequest,
    401: ErrorSchemas.unauthorized,
    500: ErrorSchemas.internal,
};

const defaultArrayErrorResponses = {
    401: ErrorSchemas.unauthorized,
    500: ErrorSchemas.internal,
};

type ErrorResponseMap = Record<number, ReturnType<typeof errorResponseSchema>>;

interface ResponseOptions {
    errors?: ErrorResponseMap;
    includeDefaults?: boolean;
    isDetail?: boolean;
}

export const createApiResponseSchema = <T extends TSchema>(
    dataSchema: T,
    options?: ResponseOptions,
) => {
    const { errors = {}, includeDefaults = true, isDetail = false } = options ?? {};

    const baseDefaults = isDetail
        ? { ...defaultErrorResponses, 404: ErrorSchemas.notFound }
        : defaultErrorResponses;

    const errorResponses = includeDefaults ? { ...baseDefaults, ...errors } : errors;

    return {
        200: successResponseSchema(dataSchema),
        ...errorResponses,
    };
};

export const createApiResponseArraySchema = <T extends TSchema>(
    dataSchema: T,
    options?: ResponseOptions,
) => {
    const { errors = {}, includeDefaults = true } = options ?? {};

    const errorResponses = includeDefaults ? { ...defaultArrayErrorResponses, ...errors } : errors;

    return {
        200: successResponseSchema(t.Array(dataSchema)),
        ...errorResponses,
    };
};

export const createApiResponseSchemaWithPagination = <T extends TSchema>(
    dataSchema: T,
    options?: ResponseOptions,
) => {
    const { errors = {}, includeDefaults = true } = options ?? {};

    const errorResponses = includeDefaults ? { ...defaultArrayErrorResponses, ...errors } : errors;

    return {
        200: successResponseWithPaginationSchema(dataSchema),
        ...errorResponses,
    };
};

export const createErrorSchema = errorResponseSchema;
