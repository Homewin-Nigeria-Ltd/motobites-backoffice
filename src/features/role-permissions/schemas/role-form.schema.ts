import { z } from "zod/v3"

export const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.record(z.string(), z.boolean()),
})

export type RoleFormSchemaValues = z.infer<typeof roleFormSchema>
