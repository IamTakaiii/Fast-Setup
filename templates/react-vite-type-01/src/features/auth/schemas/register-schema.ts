import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().min(2, { message: "auth.validation.name_min_length" }),
		email: z.email({ message: "auth.validation.invalid_email" }),
		password: z.string().min(8, { message: "auth.validation.password_min_length" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "auth.validation.password_mismatch",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
