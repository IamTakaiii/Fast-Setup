import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { RegisterFormValues, registerSchema } from "../schemas/register-schema";

export function useRegister() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: RegisterFormValues) {
		setIsLoading(true);
		setError(null);
		try {
			const { error: signUpError } = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
			});

			if (signUpError) {
				setError(signUpError.statusText || "Failed to sign up");
			} else {
				window.location.href = "/dashboard";
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	}

	const handleSocialSignUp = async (provider: "github" | "google") => {
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
		handleSocialSignUp,
	};
}
