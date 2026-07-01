import { z } from "zod/v3"

import { ticketTypes, type TicketType } from "../types"

export const ticketTypeOptions = [
  { value: "complaint", label: "Complaint" },
  { value: "request", label: "Request" },
  { value: "enquiry", label: "Enquiry" },
  { value: "suggestion", label: "Suggestion" },
] as const satisfies ReadonlyArray<{ value: TicketType; label: string }>

export const createTicketSchema = z.object({
  type: z.enum(ticketTypes),
  issueCategory: z.string().min(1, "Issue category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  resolverId: z.string().min(1, "Resolver is required"),
  orderId: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || z.string().uuid().safeParse(value).success,
      "Enter a valid order ID"
    ),
})

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>

export const createTicketFormDefaults: CreateTicketFormValues = {
  type: "complaint",
  issueCategory: "",
  description: "",
  resolverId: "",
  orderId: "",
}
