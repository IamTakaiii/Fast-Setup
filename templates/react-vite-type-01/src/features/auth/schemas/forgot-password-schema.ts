import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.email({ message: "auth.validation.invalid_email" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
