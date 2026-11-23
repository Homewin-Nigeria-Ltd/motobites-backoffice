import { z } from "zod/v3"

import {
  offerDiscountModeOptions,
  offerEligibleUsersOptions,
  offerRestrictionOptions,
  offerStatusOptions,
  offerUsageLimitOptions,
} from "../constants"

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

const offerUsageLimitValues = offerUsageLimitOptions.map(
  (option) => option.value
) as [
  (typeof offerUsageLimitOptions)[number]["value"],
  ...(typeof offerUsageLimitOptions)[number]["value"][],
]

const offerEligibleUsersValues = offerEligibleUsersOptions.map(
  (option) => option.value
) as [
  (typeof offerEligibleUsersOptions)[number]["value"],
  ...(typeof offerEligibleUsersOptions)[number]["value"][],
]

const offerStatusValues = offerStatusOptions.map((option) => option.value) as [
  (typeof offerStatusOptions)[number]["value"],
  ...(typeof offerStatusOptions)[number]["value"][],
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
    percentageValue: z.string(),
    flatAmount: z.string(),
    usageLimitType: z.enum(offerUsageLimitValues, {
      message: "Usage limit is required",
    }),
    usageLimit: z.string(),
    maxUses: z.string(),
    startDate: z.string().trim().min(1, "Start date is required"),
    endDate: z.string().trim().min(1, "End date is required"),
    promoCode: z.string().trim().min(1, "Promo code is required"),
    minimumOrderValue: z.string(),
    discountCap: z.string(),
    eligibleUsers: z.enum(offerEligibleUsersValues, {
      message: "Eligible users is required",
    }),
    selectedCustomers: z.array(z.string()),
    customerGroups: z.array(z.string()),
    status: z.enum(offerStatusValues, {
      message: "Status is required",
    }),
    restriction: z.enum(offerRestrictionValues, {
      message: "Restriction is required",
    }),
    kitchenId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.discountMode === "flat") {
      const amount = Number(values.flatAmount)
      if (!Number.isFinite(amount) || amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount is required",
          path: ["flatAmount"],
        })
      }
    } else {
      const percentage = Number(values.percentageValue)
      if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a percentage between 1 and 100",
          path: ["percentageValue"],
        })
      }
    }

    if (values.usageLimitType === "multiple") {
      const limit = Number(values.usageLimit)
      if (!Number.isFinite(limit) || limit < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter how many times each customer can use this code",
          path: ["usageLimit"],
        })
      }
    }

    if (values.maxUses.trim()) {
      const totalUses = Number(values.maxUses)
      if (!Number.isFinite(totalUses) || totalUses < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total uses must be 1 or greater",
          path: ["maxUses"],
        })
      }
    }

    const minOrder = values.minimumOrderValue.trim()
    if (minOrder) {
      const parsed = Number(minOrder)
      if (!Number.isFinite(parsed) || parsed < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum order must be 0 or greater",
          path: ["minimumOrderValue"],
        })
      }
    }

    const cap = values.discountCap.trim()
    if (cap) {
      const parsed = Number(cap)
      if (!Number.isFinite(parsed) || parsed < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount cap must be 0 or greater",
          path: ["discountCap"],
        })
      }
    }

    if (
      values.eligibleUsers === "selected_customers" &&
      values.selectedCustomers.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one customer",
        path: ["selectedCustomers"],
      })
    }

    if (
      values.eligibleUsers === "customer_groups" &&
      values.customerGroups.length === 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select at least one customer group",
        path: ["customerGroups"],
      })
    }

    if (
      values.restriction === "specific_kitchen" &&
      !values.kitchenId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kitchen is required",
        path: ["kitchenId"],
      })
    }

    if (values.endDate < values.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endDate"],
      })
    }
  })

export type CreateOfferFormValues = z.infer<typeof createOfferFormSchema>

export const createOfferFormDefaults: CreateOfferFormValues = {
  promotionName: "",
  promotionDescription: "",
  discountMode: "percentage",
  percentageValue: "10",
  flatAmount: "500",
  usageLimitType: "once_per_customer",
  usageLimit: "1",
  maxUses: "",
  startDate: "",
  endDate: "",
  promoCode: "",
  minimumOrderValue: "0",
  discountCap: "",
  eligibleUsers: "all",
  selectedCustomers: [],
  customerGroups: [],
  status: "active",
  restriction: "all_kitchen",
  kitchenId: "",
}
