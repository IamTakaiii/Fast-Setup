import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "../schemas/login-schema";

export function useLogin() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: LoginFormValues) {
		setIsLoading(true);
		setError(null);
		try {
			const { error: signInError } = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (signInError) {
				setError(signInError.statusText || "Failed to sign in");
			} else {
				window.location.href = "/dashboard";
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}

	const handleSocialSignIn = async (provider: "github" | "google") => {
		setIsLoading(true);
		setError(null);
		try {
			await authClient.signIn.social({
				provider,
			});
		} catch (err) {
			console.error(err);
			setError("Failed to connect with social provider");
		} finally {
			setIsLoading(false);
		}
	};

	return {
		form,
		isLoading,
		error,
		onSubmit,
		handleSocialSignIn,
	};
}
