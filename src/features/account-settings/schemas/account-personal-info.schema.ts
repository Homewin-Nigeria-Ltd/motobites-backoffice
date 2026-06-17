import { z } from "zod/v3"

export const accountPersonalInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  language: z.string().min(1, "Language is required"),
  profile_photo_path: z.string().optional(),
  profile_photo: z.string().optional(),
})

export type AccountPersonalInfoFormValues = z.infer<
  typeof accountPersonalInfoSchema
>

export function getAccountPersonalInfoDefaults(
  firstName: string,
  lastName: string,
  language = "en-US"
): AccountPersonalInfoFormValues {
  return {
    first_name: firstName,
    last_name: lastName,
    language,
    profile_photo_path: "",
    profile_photo: "",
  }
}
