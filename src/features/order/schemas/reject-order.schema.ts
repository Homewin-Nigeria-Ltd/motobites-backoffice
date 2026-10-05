import { z } from "zod/v3"

export const rejectOrderSchema = z.object({
  reason: z.string().trim().min(1, "Rejection reason is required"),
})

export type RejectOrderFormValues = z.infer<typeof rejectOrderSchema>
