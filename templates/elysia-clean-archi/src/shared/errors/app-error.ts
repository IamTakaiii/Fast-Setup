export class AppError extends Error {
    public statusCode: number;
    public messageKey: string;
    public details?: unknown[];

    constructor(messageKey: string, statusCode = 500, details?: unknown[]) {
        super(messageKey);
        this.messageKey = messageKey;
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class BadRequestError extends AppError {
    constructor(messageKey = "errors.bad_request", details?: unknown[]) {
        super(messageKey, 400, details);
    }
}

export class UnauthorizedError extends AppError {
    constructor(messageKey = "errors.unauthorized", details?: unknown[]) {
        super(messageKey, 401, details);
    }
}

export class ForbiddenError extends AppError {
    constructor(messageKey = "errors.forbidden", details?: unknown[]) {
        super(messageKey, 403, details);
    }
}

export class NotFoundError extends AppError {
    constructor(messageKey = "errors.not_found", details?: unknown[]) {
        super(messageKey, 404, details);
    }
}

export class ConflictError extends AppError {
    constructor(messageKey = "errors.conflict", details?: unknown[]) {
        super(messageKey, 409, details);
    }
}

export class ValidationError extends AppError {
    constructor(messageKey = "errors.validation", details?: unknown[]) {
        super(messageKey, 422, details);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(messageKey = "errors.too_many_requests", details?: unknown[]) {
        super(messageKey, 429, details);
    }
}

export class InternalServerError extends AppError {
    constructor(messageKey = "errors.internal", details?: unknown[]) {
        super(messageKey, 500, details);
    }
}

export class NotImplementedError extends AppError {
    constructor(messageKey = "errors.not_implemented", details?: unknown[]) {
        super(messageKey, 501, details);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(messageKey = "errors.service_unavailable", details?: unknown[]) {
        super(messageKey, 503, details);
    }
}
