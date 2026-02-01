import type { ParseKeys } from "i18next";
import { useTranslation } from "node_modules/react-i18next";

/**
 * Hook for translating form validation error messages.
 * This safely handles the type conversion from string to translation keys.
 *
 * @example
 * const { translateError } = useTranslateError();
 *
 * {errors.email?.message && (
 *   <p className="text-destructive">{translateError(errors.email.message)}</p>
 * )}
 */
export function useTranslateError() {
    const { t } = useTranslation();

    /**
     * Translates an error message key to the localized string.
     * Returns null if no message is provided.
     */
    const translateError = (message: string | undefined): string | null => {
        if (!message) return null;
        return t(message as ParseKeys);
    };

    return { translateError };
}
