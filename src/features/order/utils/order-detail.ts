import type {
  ApiOrderAssignee,
  ApiOrderDetailData,
  ApiOrderDetailItem,
  ApiOrderGift,
  ApiOrderItemAddon,
  ApiOrderPaymentBreakdown,
  ApiOrderReview,
} from "@/features/order/types"
import { formatDate } from "@/features/order/utils/date"

export function formatOrderReviewText(
  review: ApiOrderReview | string | null | undefined
) {
  if (review == null) {
    return "—"
  }

  if (typeof review === "string") {
    return review.trim() || "—"
  }

  if (!review.comment?.trim()) {
    return "—"
  }

  return review.comment.trim()
}

export function formatOrderReviewRemark(
  review: ApiOrderReview | string | null | undefined
) {
  if (review == null) {
    return null
  }

  if (typeof review === "string") {
    return review.trim() || null
  }

  if (!review.remark?.trim()) {
    return null
  }

  return review.remark.trim()
}

function toAssignee(
  value: ApiOrderAssignee | string | null | undefined
): ApiOrderAssignee {
  if (!value) {
    return null
  }

  if (typeof value === "string") {
    const name = value.trim()
    return name ? { id: 0, name } : null
  }

  return value
}

export function formatOrderTiming(value?: string | null) {
  if (!value?.trim()) {
    return "—"
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : formatDate(value)
}

export function getOrderCustomerCareAssignee(order: ApiOrderDetailData) {
  return (
    order.assignments?.support ??
    toAssignee(order.assigned_customer_care_representative) ??
    toAssignee(order.customer_care_representative)
  )
}

export function getOrderItemAddons(item: ApiOrderDetailItem): ApiOrderItemAddon[] {
  const lists = [
    item.addons,
    item.selected_addons,
    item.modifiers,
    item.selected_modifiers,
  ]

  for (const list of lists) {
    if (Array.isArray(list) && list.length > 0) {
      return list
    }
  }

  return []
}

export function formatGiftAddress(
  address: ApiOrderGift["delivery_address"]
) {
  if (address == null) {
    return null
  }

  if (typeof address === "string") {
    return address.trim() || null
  }

  const parts = [address.line1, address.line2, address.city, address.state]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))

  return parts.length > 0 ? parts.join(", ") : null
}

export type PaymentBreakdownLine = {
  label: string
  kobo: number
  negative?: boolean
}

function pushBreakdownLine(
  lines: PaymentBreakdownLine[],
  label: string,
  kobo: number | undefined,
  options?: { always?: boolean; negative?: boolean }
) {
  if (typeof kobo !== "number" || !Number.isFinite(kobo)) {
    return
  }

  if (!options?.always && kobo <= 0) {
    return
  }

  lines.push({ label, kobo, negative: options?.negative })
}

export function getPaymentBreakdownLines(breakdown: ApiOrderPaymentBreakdown) {
  const charges: PaymentBreakdownLine[] = []
  const reductions: PaymentBreakdownLine[] = []

  pushBreakdownLine(charges, "Items subtotal", breakdown.charges?.items_subtotal_kobo, {
    always: true,
  })
  pushBreakdownLine(charges, "Delivery fee", breakdown.charges?.delivery_fee_kobo)
  pushBreakdownLine(charges, "Service fee", breakdown.charges?.service_fee_kobo, {
    always: true,
  })
  pushBreakdownLine(charges, "Rider tip", breakdown.charges?.rider_tip_kobo, {
    always: true,
  })

  pushBreakdownLine(
    reductions,
    "Promo discount",
    breakdown.reductions?.promo_discount_kobo,
    { negative: true }
  )
  pushBreakdownLine(
    reductions,
    "Scheduled delivery discount",
    breakdown.reductions?.scheduled_delivery_discount_kobo,
    { negative: true }
  )
  pushBreakdownLine(
    reductions,
    "Welcome bonus",
    breakdown.reductions?.welcome_bonus_kobo,
    { negative: true }
  )
  pushBreakdownLine(
    reductions,
    "Cashback",
    breakdown.reductions?.cashback_kobo,
    { negative: true }
  )
  pushBreakdownLine(
    reductions,
    "Reward wallet",
    breakdown.reductions?.reward_wallet_kobo,
    { negative: true }
  )
  pushBreakdownLine(
    reductions,
    "Refund credit",
    breakdown.reductions?.refund_credit_kobo,
    { negative: true }
  )

  const amountDueKobo =
    typeof breakdown.amount_due_kobo === "number"
      ? breakdown.amount_due_kobo
      : typeof breakdown.calculated_amount_due_kobo === "number"
        ? breakdown.calculated_amount_due_kobo
        : null

  return {
    currency: breakdown.currency ?? "NGN",
    charges,
    reductions,
    amountDueKobo,
    payment: breakdown.payment,
  }
}
