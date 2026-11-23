import { formatFlatOfferDetails } from "../constants"
import type { CreateOfferFormValues } from "../schemas/create-offer.schema"
import type { OfferInput } from "../types"

function toKobo(naira: number) {
  return Math.round(naira * 100)
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function parseIds(values: string[]): number[] {
  return values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0)
}

function buildUsageFields(values: CreateOfferFormValues): {
  max_uses_per_customer: number
  is_reusable: boolean
  max_uses: number | null
} {
  if (values.usageLimitType === "multiple") {
    return {
      max_uses_per_customer: Math.max(1, Number(values.usageLimit) || 1),
      is_reusable: true,
      max_uses: parseOptionalNumber(values.maxUses),
    }
  }

  return {
    max_uses_per_customer: 1,
    is_reusable: false,
    max_uses: parseOptionalNumber(values.maxUses),
  }
}

export function buildOfferInput(values: CreateOfferFormValues): OfferInput {
  const name = values.promotionName.trim()
  const description = values.promotionDescription.trim()
  const promoCode = values.promoCode.trim().toUpperCase()
  const kitchenId =
    values.restriction === "specific_kitchen" && values.kitchenId
      ? Number(values.kitchenId)
      : null
  const usage = buildUsageFields(values)
  const eligibilityType = values.eligibleUsers
  const minimumOrderValue = parseOptionalNumber(values.minimumOrderValue) ?? 0
  const discountCap = parseOptionalNumber(values.discountCap)

  const eligibleCustomerIds =
    eligibilityType === "selected_customers"
      ? parseIds(values.selectedCustomers)
      : []
  const eligibleGroupIds =
    eligibilityType === "customer_groups"
      ? parseIds(values.customerGroups)
      : []

  const discount =
    values.discountMode === "flat"
      ? {
          discount_type: "flat_amount" as const,
          discount_value: Math.round(Number(values.flatAmount)),
          details: formatFlatOfferDetails(Number(values.flatAmount)),
        }
      : {
          discount_type: "percentage" as const,
          discount_value: Math.round(Number(values.percentageValue)),
          details: `${Math.round(Number(values.percentageValue))}% of`,
        }

  return {
    name,
    promotion_name: name,
    description,
    promotion_description: description,
    promo_code: promoCode,
    promotion_code: promoCode,
    discount_type: discount.discount_type,
    discount_value: discount.discount_value,
    details: discount.details,
    detail: discount.details,
    applies_to: "subtotal",
    restriction: values.restriction,
    kitchen_id: kitchenId,
    start_date: values.startDate,
    end_date: values.endDate,
    promo_start: values.startDate,
    promo_end: values.endDate,
    status: values.status,
    is_active: values.status === "active",
    max_uses_per_customer: usage.max_uses_per_customer,
    is_reusable: usage.is_reusable,
    max_uses: usage.max_uses,
    min_order_kobo: toKobo(minimumOrderValue),
    minimum_order_value: minimumOrderValue,
    discount_cap_kobo: discountCap == null ? null : toKobo(discountCap),
    discount_cap: discountCap,
    eligibility_type: eligibilityType,
    eligible_customer_ids: eligibleCustomerIds,
    eligible_group_ids: eligibleGroupIds,
  }
}
