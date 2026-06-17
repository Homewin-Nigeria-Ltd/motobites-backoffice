import { z } from "zod/v3"

export const accountPasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(1, "New password is required"),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "New password and confirmation do not match",
    path: ["password_confirmation"],
  })

export type AccountPasswordFormValues = z.infer<typeof accountPasswordSchema>

export const accountPasswordDefaults: AccountPasswordFormValues = {
  current_password: "",
  password: "",
  password_confirmation: "",
}
