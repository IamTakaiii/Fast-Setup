import { i18next } from "@shared/i18n/i18n.config";

export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

export interface ApiResponseData<T, M = unknown> {
    success: boolean;
    message: string;
    data: T;
    meta?: M;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error: {
        code: string;
        details: unknown;
    };
}

export const ApiResponse = {
    success<T, M = unknown>(
        data: T,
        messageKey = "success",
        lng = "en",
        meta?: M,
    ): ApiResponseData<T, M> {
        return {
            success: true,
            message: i18next.t(messageKey, { lng }),
            data,
            meta,
        };
    },

    error(messageKey: string, lng = "en", code?: string, details?: unknown): ApiErrorResponse {
        return {
            success: false,
            message: i18next.t(messageKey, { lng }),
            error: {
                code: code || messageKey.toUpperCase().replace(/\./g, "_"),
                details: details || null,
            },
        };
    },
};
