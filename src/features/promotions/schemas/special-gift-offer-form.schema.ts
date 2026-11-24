import { z } from "zod/v3"

export const specialGiftOfferFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    minimumBasketValue: z.coerce
      .number()
      .positive("Minimum basket value must be greater than zero"),
    giftMenuItemId: z.string().trim().min(1, "Gift menu item is required"),
    giftQuantity: z.coerce
      .number()
      .int("Gift quantity must be a whole number")
      .positive("Gift quantity must be at least 1"),
    startsAt: z.string().trim().min(1, "Start date is required"),
    endsAt: z.string().trim().min(1, "End date is required"),
    isActive: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.endsAt < values.startsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endsAt"],
      })
    }
  })

export type SpecialGiftOfferFormValues = z.infer<
  typeof specialGiftOfferFormSchema
>

export const specialGiftOfferFormDefaults: SpecialGiftOfferFormValues = {
  name: "",
  minimumBasketValue: 10000,
  giftMenuItemId: "",
  giftQuantity: 1,
  startsAt: "",
  endsAt: "",
  isActive: true,
}
