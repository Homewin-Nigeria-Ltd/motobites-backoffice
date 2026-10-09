import type {
  ApiOrderDetailItem,
  ApiOrderItemAddon,
  ApiOrderPaymentBreakdown,
  ApiOrderReview,
} from "@/features/order/types"

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
  if (review == null || typeof review === "string") {
    return null
  }

  if (!review.remark?.trim()) {
    return null
  }

  return review.remark.trim()
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
  pushBreakdownLine(charges, "Service fee", breakdown.charges?.service_fee_kobo)
  pushBreakdownLine(charges, "Rider tip", breakdown.charges?.rider_tip_kobo)

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
