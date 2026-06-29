import { z } from "zod/v3"

import {
  offerDetailOptions,
  offerRestrictionOptions,
} from "../constants"

const offerDetailValues = offerDetailOptions.map((option) => option.value) as [
  (typeof offerDetailOptions)[number]["value"],
  ...(typeof offerDetailOptions)[number]["value"][],
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
    details: z.enum(offerDetailValues, {
      message: "Details is required",
    }),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().min(1, "End date is required"),
    promoCode: z.string().trim().min(1, "Promo code is required"),
    restriction: z.enum(offerRestrictionValues, {
      message: "Restriction is required",
    }),
    kitchenId: z.string().optional(),
  })
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
  details: "percentage:20",
  startDate: "",
  endDate: "",
  promoCode: "",
  restriction: "all_kitchen",
  kitchenId: "",
}
