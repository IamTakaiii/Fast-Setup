import { z } from "zod";

export const loginSchema = z.object({
	email: z.email({ message: "auth.validation.invalid_email" }),
	password: z.string().min(1, { message: "auth.validation.password_required" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
