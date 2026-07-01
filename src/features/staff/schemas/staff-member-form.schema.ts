import { z } from "zod/v3"

export const staffMemberFormSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  role: z.string().min(1, "Role is required"),
  branchId: z.string().min(1, "Branch is required"),
})

export type StaffMemberFormValues = z.infer<typeof staffMemberFormSchema>

export const staffMemberFormDefaults: StaffMemberFormValues = {
  name: "",
  email: "",
  role: "",
  branchId: "",
}
