import {
  isFlatDiscountType,
  offerEligibleUsersOptions,
  offerRestrictionOptions,
  offerStatusOptions,
} from "../constants"
import type { CreateOfferFormValues } from "../schemas/create-offer.schema"
import type { ApiOffer, OfferUsageTracking } from "../types"

function resolveOfferDescription(offer: ApiOffer) {
  const description = offer.promotion_description || offer.description

  if (description && description !== "string") {
    return description
  }

  return offer.details_label || offer.details || offer.detail || ""
}

function resolveUsageLimitType(
  offer: ApiOffer
): CreateOfferFormValues["usageLimitType"] {
  const reusable = offer.is_reusable

  if (reusable === true || reusable === 1 || reusable === "true") {
    return "multiple"
  }

  if (reusable === false || reusable === 0 || reusable === "false") {
    return "once_per_customer"
  }

  const perCustomer = Number(offer.max_uses_per_customer)
  if (Number.isFinite(perCustomer) && perCustomer > 1) {
    return "multiple"
  }

  return "once_per_customer"
}

function resolveEligibleUsers(
  offer: ApiOffer
): CreateOfferFormValues["eligibleUsers"] {
  const eligibilityType = offer.eligibility_type
  if (
    typeof eligibilityType === "string" &&
    offerEligibleUsersOptions.some((option) => option.value === eligibilityType)
  ) {
    return eligibilityType as CreateOfferFormValues["eligibleUsers"]
  }

  if (
    Array.isArray(offer.eligible_group_ids) &&
    offer.eligible_group_ids.length > 0
  ) {
    return "customer_groups"
  }

  const customerIds = resolveEligibleCustomerIds(offer)
  if (customerIds.length > 0) {
    return "selected_customers"
  }

  return "all"
}

function resolveEligibleCustomerIds(offer: ApiOffer): string[] {
  if (
    Array.isArray(offer.eligible_customer_ids) &&
    offer.eligible_customer_ids.length > 0
  ) {
    return offer.eligible_customer_ids.map(String)
  }

  if (Array.isArray(offer.selected_customers) && offer.selected_customers.length > 0) {
    return offer.selected_customers.map(String)
  }

  if (Array.isArray(offer.eligible_users)) {
    return offer.eligible_users.map(String).filter(Boolean)
  }

  return []
}

function resolveStatus(offer: ApiOffer): CreateOfferFormValues["status"] {
  const normalized = (offer.status || "").toLowerCase()
  if (offerStatusOptions.some((option) => option.value === normalized)) {
    return normalized as CreateOfferFormValues["status"]
  }

  if (offer.is_paused) {
    return "paused"
  }

  return offer.is_active ? "active" : "inactive"
}

export function mapApiOfferToFormValues(offer: ApiOffer): CreateOfferFormValues {
  const isFlat = isFlatDiscountType(offer.discount_type)
  const restriction = offerRestrictionOptions.some(
    (option) => option.value === offer.restriction
  )
    ? (offer.restriction as CreateOfferFormValues["restriction"])
    : offer.kitchen_id
      ? "specific_kitchen"
      : "all_kitchen"

  const groupIds = Array.isArray(offer.eligible_group_ids)
    ? offer.eligible_group_ids.map(String)
    : (offer.customer_groups ?? [])

  return {
    promotionName: offer.promotion_name || offer.name || offer.title,
    promotionDescription: resolveOfferDescription(offer),
    discountMode: isFlat ? "flat" : "percentage",
    percentageValue: isFlat
      ? "10"
      : String(offer.discount_value ?? 10),
    flatAmount:
      isFlat && offer.discount_value != null
        ? String(offer.discount_value)
        : "500",
    usageLimitType: resolveUsageLimitType(offer),
    usageLimit: String(offer.max_uses_per_customer ?? 1),
    maxUses: offer.max_uses != null ? String(offer.max_uses) : "",
    startDate: offer.start_date || offer.promo_start,
    endDate: offer.end_date || offer.promo_end,
    promoCode: offer.promo_code || offer.promotion_code || offer.code,
    minimumOrderValue: String(
      offer.minimum_order_value ??
        (offer.min_order_kobo != null
          ? offer.min_order_kobo / 100
          : 0)
    ),
    discountCap:
      offer.discount_cap != null
        ? String(offer.discount_cap)
        : offer.discount_cap_kobo != null
          ? String(offer.discount_cap_kobo / 100)
          : "",
    eligibleUsers: resolveEligibleUsers(offer),
    selectedCustomers: resolveEligibleCustomerIds(offer),
    customerGroups: groupIds,
    status: resolveStatus(offer),
    restriction,
    kitchenId: offer.kitchen_id != null ? String(offer.kitchen_id) : "",
  }
}

export function mapApiOfferToUsageTracking(
  offer: ApiOffer,
  usageTracking?: {
    total_uses?: number | null
    confirmed_uses?: number | null
    reserved_uses?: number | null
    remaining_uses?: number | null
    unique_customers_redeemed?: number | null
    total_discounts_given_kobo?: number | null
  } | null
): OfferUsageTracking {
  const totalDiscountKobo =
    usageTracking?.total_discounts_given_kobo ??
    offer.total_discounts_given_kobo ??
    null

  return {
    timesUsed:
      usageTracking?.total_uses ??
      offer.total_uses ??
      offer.usage_count ??
      offer.times_used ??
      0,
    customersRedeemed:
      usageTracking?.unique_customers_redeemed ??
      offer.customers_redeemed ??
      0,
    totalDiscountGiven:
      totalDiscountKobo != null
        ? totalDiscountKobo / 100
        : (offer.total_discounts_given ?? 0),
    remainingUses:
      usageTracking?.remaining_uses ??
      offer.remaining_uses ??
      null,
    confirmedUses:
      usageTracking?.confirmed_uses ??
      offer.confirmed_usage_count ??
      0,
    reservedUses:
      usageTracking?.reserved_uses ??
      offer.reserved_usage_count ??
      0,
  }
}

export const emptyOfferUsageTracking: OfferUsageTracking = {
  timesUsed: 0,
  customersRedeemed: 0,
  totalDiscountGiven: 0,
  remainingUses: null,
}
