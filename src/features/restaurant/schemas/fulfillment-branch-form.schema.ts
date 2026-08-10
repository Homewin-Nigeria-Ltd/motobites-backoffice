import { z } from "zod/v3"

export const fulfillmentBranchFormSchema = z
  .object({
    key: z.string().trim(),
    name: z.string().trim(),
    address: z.string().trim(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    isActive: z.boolean(),
    isOpen: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Location is required",
        path: ["address"],
      })
    }

    if (!Number.isFinite(data.latitude) || !Number.isFinite(data.longitude)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a location from the suggestions",
        path: ["address"],
      })
    }

    if (!data.key) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a location from the suggestions",
        path: ["address"],
      })
    }

    if (!data.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a location from the suggestions",
        path: ["address"],
      })
    }
  })

export type FulfillmentBranchFormValues = z.infer<
  typeof fulfillmentBranchFormSchema
>

export const fulfillmentBranchFormDefaults: FulfillmentBranchFormValues = {
  key: "",
  name: "",
  address: "",
  latitude: Number.NaN,
  longitude: Number.NaN,
  isActive: true,
  isOpen: true,
}
