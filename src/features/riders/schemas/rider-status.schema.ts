import { z } from "zod/v3"

export const rejectRiderSchema = z.object({
  review_notes: z.string().trim().min(1, "Rejection reason is required"),
})

export type RejectRiderFormValues = z.infer<typeof rejectRiderSchema>
