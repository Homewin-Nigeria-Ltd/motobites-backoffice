import { z } from "zod/v3"

export const increaseCnplEligibilitySchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: "Enter a valid amount",
    })
    .positive("Amount must be greater than zero"),
})

export type IncreaseCnplEligibilityFormValues = z.infer<
  typeof increaseCnplEligibilitySchema
>
