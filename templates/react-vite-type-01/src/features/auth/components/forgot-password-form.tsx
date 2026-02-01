import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { useTranslation } from "node_modules/react-i18next";
import { useTranslateError } from "@/hooks/use-translate-error";
import { Link } from "@tanstack/react-router";

export function ForgotPasswordForm() {
    const { t } = useTranslation();
    const { translateError } = useTranslateError();
    const { form, isLoading, error, isSuccess, onSubmit, resetForm } =
        useForgotPassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    // Success state - show confirmation message
    if (isSuccess) {
        return (
            <div className="grid gap-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                            {t("auth.forgot_password.success_title")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {t("auth.forgot_password.success_description")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button variant="outline" onClick={resetForm} className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        {t("auth.forgot_password.try_another_email")}
                    </Button>

                    <Link to="/login" className="w-full">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t("auth.forgot_password.back_to_login")}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("auth.fields.email")}</Label>
                        <Input
                            id="email"
                            placeholder={t("auth.placeholders.email")}
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            {...register("email")}
                            className={cn(
                                errors.email &&
                                "border-destructive focus-visible:ring-destructive/30"
                            )}
                        />
                        {errors.email?.message && (
                            <p className="text-sm text-destructive">
                                {translateError(errors.email.message)}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                            {translateError(error) || error}
                        </div>
                    )}

                    <Button disabled={isLoading} className="w-full mt-2" size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("auth.forgot_password.submit")}
                    </Button>
                </div>
            </form>

            <Link to="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("auth.forgot_password.back_to_login")}
                </Button>
            </Link>
        </div>
    );
}
