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

export const ApiResponse = {
    success<T, M = unknown>(data: T, messageKey = "success", lng = "en", meta?: M): ApiResponseData<T, M> {
        return {
            success: true,
            message: i18next.t(messageKey, { lng }),
            data,
            meta,
        };
    },

    error(messageKey: string, lng = "en", meta?: unknown): ApiResponseData<undefined> {
        return {
            success: false,
            message: i18next.t(messageKey, { lng }),
            data: undefined,
            meta,
        };
    },
};
