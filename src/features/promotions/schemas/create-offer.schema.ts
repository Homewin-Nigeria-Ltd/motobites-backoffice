import { z } from "zod/v3"

import {
  offerDetailOptions,
  offerDiscountModeOptions,
  offerRestrictionOptions,
} from "../constants"

const offerDetailValues = offerDetailOptions.map((option) => option.value) as [
  (typeof offerDetailOptions)[number]["value"],
  ...(typeof offerDetailOptions)[number]["value"][],
]

const offerDiscountModeValues = offerDiscountModeOptions.map(
  (option) => option.value
) as [
  (typeof offerDiscountModeOptions)[number]["value"],
  ...(typeof offerDiscountModeOptions)[number]["value"][],
]

const offerRestrictionValues = offerRestrictionOptions.map(
  (option) => option.value
) as [
  (typeof offerRestrictionOptions)[number]["value"],
  ...(typeof offerRestrictionOptions)[number]["value"][],
]

export const createOfferFormSchema = z
  .object({
    promotionName: z.string().trim().min(1, "Promotion name is required"),
    promotionDescription: z
      .string()
      .trim()
      .min(1, "Promotion description is required"),
    discountMode: z.enum(offerDiscountModeValues, {
      message: "Discount type is required",
    }),
    details: z.enum(offerDetailValues, {
      message: "Details is required",
    }),
    flatAmount: z.string(),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().min(1, "End date is required"),
    promoCode: z.string().trim().min(1, "Promo code is required"),
    restriction: z.enum(offerRestrictionValues, {
      message: "Restriction is required",
    }),
    kitchenId: z.string().optional(),
  })
  .refine(
    (values) => {
      if (values.discountMode !== "flat") {
        return true
      }

      const amount = Number(values.flatAmount)
      return Number.isFinite(amount) && amount > 0
    },
    {
      message: "Amount is required",
      path: ["flatAmount"],
    }
  )
  .refine(
    (values) =>
      values.restriction !== "specific_kitchen" || Boolean(values.kitchenId),
    {
      message: "Kitchen is required",
      path: ["kitchenId"],
    }
  )
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })

export type CreateOfferFormValues = z.infer<typeof createOfferFormSchema>

export const createOfferFormDefaults: CreateOfferFormValues = {
  promotionName: "",
  promotionDescription: "",
  discountMode: "percentage",
  details: "percentage:20",
  flatAmount: "",
  startDate: "",
  endDate: "",
  promoCode: "",
  restriction: "all_kitchen",
  kitchenId: "",
}
