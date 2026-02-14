import { Elysia, type ErrorHandler } from "elysia";
import { AppError } from "@shared/errors/app-error";
import { ApiResponse } from "@shared/response/response.util";
import { i18next } from "@shared/i18n/i18n.config";

const isAppError = (error: unknown): error is AppError => {
    return (
        error instanceof AppError ||
        (error !== null &&
            typeof error === "object" &&
            "messageKey" in error &&
            "statusCode" in error)
    );
};

export const handleError: ErrorHandler = ({ code, error, set, request }) => {
    const lng = request.headers.get("accept-language")?.split(",")[0] || "en";

    console.log("[ErrorHandler] i18next ready:", i18next.isInitialized);
    console.error(error);

    if (isAppError(error)) {
        set.status = error.statusCode;
        const code = error.messageKey
            .replace(/^errors\./, "")
            .toUpperCase()
            .replace(/\./g, "_");

        return ApiResponse.error(
            error.messageKey,
            lng,
            code,
            error.details,
        );
    }

    if (code === "NOT_FOUND") {
        set.status = 404;
        return ApiResponse.error("errors.not_found", lng, "NOT_FOUND");
    }

    if (code === "VALIDATION") {
        set.status = 422;
        const validationErrors = (error as any).all || [];

        const formattedErrors = validationErrors.map((err: any) => ({
            field: err.path?.replace(/^\//, ""),
            message: err.summary || err.message || "Validation failed",
            value: err.value,
            expected: err.schema?.format || err.schema?.type,
        }));

        return ApiResponse.error("errors.validation", lng, "VALIDATION_ERROR", formattedErrors);
    }

    set.status = 500;
    return ApiResponse.error(
        "errors.internal",
        lng,
        "INTERNAL_SERVER_ERROR",
        process.env.NODE_ENV === "development" ? [error] : [],
    );
};

export const errorMiddleware = new Elysia().onError(handleError);
