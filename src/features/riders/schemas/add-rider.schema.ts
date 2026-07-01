import { z } from "zod/v3"

export const riderGenderOptions = ["male", "female", "other"] as const

export type RiderGender = (typeof riderGenderOptions)[number]

const optionalFileSchema = z
  .union([z.instanceof(File), z.null()])
  .optional()

const baseRiderFormFields = {
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  gender: z.enum(riderGenderOptions, { message: "Gender is required" }),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  phone: z.string().trim().min(1, "Contact details are required"),
  houseAddress: z.string().trim().min(1, "Residential address is required"),
  proofOfAddress: optionalFileSchema,
  guarantorFirstName: z.string().trim().min(1, "First name is required"),
  guarantorLastName: z.string().trim().min(1, "Last name is required"),
  guarantorEmail: z.string().trim().email("Enter a valid email address"),
  guarantorPhone: z.string().trim().min(1, "Telephone is required"),
  guarantorRelationship: z.string().trim().min(1, "Relationship is required"),
  guarantorAddress: z.string().trim().min(1, "Residential address is required"),
  guarantorProofOfAddress: optionalFileSchema,
  nin: z.string().trim().min(11, "NIN must be 11 digits").max(11, "NIN must be 11 digits"),
  driverLicense: optionalFileSchema,
  bankAccountNumber: z.string().trim().min(1, "Account number is required"),
  bankName: z.string().trim().min(1, "Bank name is required"),
  bankAccountName: z.string().trim().min(1, "Account name is required"),
  branchId: z.string().min(1, "Branch is required"),
}

export const addRiderSchema = z.object({
  ...baseRiderFormFields,
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
})

export const updateRiderSchema = z.object({
  ...baseRiderFormFields,
  password: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || value.length >= 8, {
      message: "Password must be at least 8 characters",
    }),
  dateOfBirth: z.string().trim().optional().or(z.literal("")),
  guarantorEmail: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid email address",
    }),
  guarantorAddress: z.string().trim().optional().or(z.literal("")),
  bankAccountNumber: z.string().trim().optional().or(z.literal("")),
  bankName: z.string().trim().optional().or(z.literal("")),
  bankAccountName: z.string().trim().optional().or(z.literal("")),
})

export type AddRiderFormValues = z.infer<typeof addRiderSchema>
export type UpdateRiderFormValues = z.infer<typeof updateRiderSchema>
export type RiderFormValues = AddRiderFormValues

export const addRiderDefaultValues: AddRiderFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: "male",
  dateOfBirth: "",
  phone: "",
  houseAddress: "",
  proofOfAddress: null,
  guarantorFirstName: "",
  guarantorLastName: "",
  guarantorEmail: "",
  guarantorPhone: "",
  guarantorRelationship: "",
  guarantorAddress: "",
  guarantorProofOfAddress: null,
  nin: "",
  driverLicense: null,
  bankAccountNumber: "",
  bankName: "",
  bankAccountName: "",
  branchId: "",
}
