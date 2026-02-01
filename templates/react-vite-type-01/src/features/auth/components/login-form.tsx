import { Loader2, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLogin } from "../hooks/use-login";
import { useTranslation } from "node_modules/react-i18next";
import { useTranslateError } from "@/hooks/use-translate-error";

export function LoginForm() {
	const { t } = useTranslation();
	const { translateError } = useTranslateError();
	const { form, isLoading, error, onSubmit, handleSocialSignIn } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

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

					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">{t("auth.fields.password")}</Label>
							<Link
								to="/forgot-password"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								{t("auth.login.forgot_password")}
							</Link>
						</div>
						<Input
							id="password"
							placeholder={t("auth.placeholders.password")}
							type="password"
							autoComplete="current-password"
							disabled={isLoading}
							{...register("password")}
							className={cn(
								errors.password &&
								"border-destructive focus-visible:ring-destructive/30"
							)}
						/>
						{errors.password?.message && (
							<p className="text-sm text-destructive">
								{translateError(errors.password.message)}
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
						{t("auth.login.submit")}
					</Button>
				</div>
			</form>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						{t("auth.social.or_continue_with")}
					</span>
				</div>
			</div>

			<Button
				variant="outline"
				type="button"
				disabled={isLoading}
				onClick={() => handleSocialSignIn("github")}
				className="w-full"
			>
				<Github className="mr-2 h-4 w-4" />
				{t("auth.social.github")}
			</Button>

			<div className="text-center text-sm">
				{t("auth.login.no_account")}{" "}
				<Link
					to="/register"
					className="underline underline-offset-4 hover:text-primary"
				>
					{t("auth.login.sign_up_link")}
				</Link>
			</div>
		</div>
	);
}
