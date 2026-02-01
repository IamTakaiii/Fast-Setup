import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "node_modules/react-i18next";
import { AuthVisuals } from "../components/auth-visuals";
import { AuthTerms } from "../components/auth-terms";
import { ForgotPasswordForm } from "../components/forgot-password-form";

export default function ForgotPasswordPage() {
    const { t } = useTranslation();

    return (
        <div className="w-full h-screen grid lg:grid-cols-2 overflow-hidden bg-background">
            {/* Left: Decorative / Visual */}
            <div className="hidden lg:flex relative flex-col justify-between p-10 bg-zinc-900 text-white">
                <AuthVisuals />
            </div>

            {/* Right: Form */}
            <div className="relative flex flex-col items-center justify-center p-8 lg:p-12 h-full overflow-y-auto">
                <div className="absolute top-4 right-4 md:top-8 md:right-8">
                    <LanguageSwitcher />
                </div>
                <div className="mx-auto w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t("auth.forgot_password.title")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("auth.forgot_password.description")}
                        </p>
                    </div>

                    <ForgotPasswordForm />

                    <AuthTerms />
                </div>
            </div>
        </div>
    );
}
