import { Elysia, type ErrorHandler } from "elysia";
import { AppError } from "@shared/errors/app-error";
import { ApiResponse } from "@shared/response/response.util";
import { i18next } from "@shared/i18n/i18n.config";

const isAppError = (error: unknown): error is AppError => {
    return error instanceof AppError || 
           (error !== null && 
            typeof error === "object" && 
            "messageKey" in error && 
            "statusCode" in error);
};

export const handleError: ErrorHandler = ({ code, error, set, request }) => {
    const lng = request.headers.get("accept-language")?.split(",")[0] || "en";

    console.log("[ErrorHandler] i18next ready:", i18next.isInitialized);
    console.log("[ErrorHandler] test translate:", i18next.t("errors.unauthorized", { lng }));

    if (isAppError(error)) {
        set.status = error.statusCode;
        return ApiResponse.error(error.messageKey, lng, error.details);
    }

    if (code === "NOT_FOUND") {
        set.status = 404;
        return ApiResponse.error("errors.not_found", lng);
    }

    if (code === "VALIDATION") {
        set.status = 400;
        return ApiResponse.error("errors.validation", lng, (error as any).all);
    }

    set.status = 500;
    return ApiResponse.error(
        "errors.internal",
        lng,
        process.env.NODE_ENV === "development" ? error : undefined,
    );
};

export const errorMiddleware = new Elysia().onError(handleError);
