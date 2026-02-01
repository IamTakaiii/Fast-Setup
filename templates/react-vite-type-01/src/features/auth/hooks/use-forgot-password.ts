import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
    ForgotPasswordFormValues,
    forgotPasswordSchema,
} from "../schemas/forgot-password-schema";

export function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const { error: forgotError } = await authClient.requestPasswordReset({
                email: data.email,
                redirectTo: "/reset-password",
            });

            if (forgotError) {
                setError(forgotError.message || "auth.validation.forgot_password_error");
            } else {
                setIsSuccess(true);
            }
        } catch (err) {
            console.error(err);
            setError("auth.validation.unexpected_error");
        } finally {
            setIsLoading(false);
        }
    }

    const resetForm = () => {
        form.reset();
        setError(null);
        setIsSuccess(false);
    };

    return {
        form,
        isLoading,
        error,
        isSuccess,
        onSubmit,
        resetForm,
    };
}
