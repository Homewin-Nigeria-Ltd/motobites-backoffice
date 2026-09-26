// import { WALK_IN_SERVICE_FEE } from "../constants"

export function calculateOfflineOrderTotals(subtotal: number) {
  // Service charge is paused for now.
  // const serviceFee = WALK_IN_SERVICE_FEE
  const serviceFee = 0
  const total = subtotal + serviceFee

  return { subtotal, serviceFee, total }
}

export function formatOfflineOrderAmount(amount?: number | null) {
  const value = amount ?? 0
  return `₦${value.toLocaleString()}`
}

export function mapOfflineOrderPreviewTotals(
  preview: {
    subtotal?: number | null
    subtotal_kobo?: number | null
    discount?: number | null
    discount_kobo?: number | null
    discount_amount?: number | null
    discount_amount_kobo?: number | null
    discount_percentage?: number | null
    service_fee?: number | null
    service_fee_kobo?: number | null
    total?: number | null
    total_kobo?: number | null
    total_amount?: number | null
  },
  fallbackSubtotal: number,
) {
  const subtotal = resolveOfflineOrderAmount(
    preview.subtotal,
    preview.subtotal_kobo,
  ) || fallbackSubtotal
  const discount = resolveOfflineOrderAmount(
    preview.discount ?? preview.discount_amount,
    preview.discount_kobo ?? preview.discount_amount_kobo,
  )
  const serviceFee = resolveOfflineOrderAmount(
    preview.service_fee,
    preview.service_fee_kobo,
  )
  const previewTotal = resolveOfflineOrderAmount(
    preview.total ?? preview.total_amount,
    preview.total_kobo,
  )
  const total = previewTotal || Math.max(0, subtotal - discount + serviceFee)
  const discountPercentage =
    typeof preview.discount_percentage === "number" &&
    Number.isFinite(preview.discount_percentage)
      ? preview.discount_percentage
      : 0

  return { subtotal, discount, discountPercentage, serviceFee, total }
}

export function resolveOfflineOrderAmount(
  amount?: number | null,
  amountKobo?: number | null,
) {
  if (typeof amount === "number" && Number.isFinite(amount)) {
    return amount
  }

  if (typeof amountKobo === "number" && Number.isFinite(amountKobo)) {
    return amountKobo / 100
  }

  return 0
}

export function generateOfflineOrderNumber() {
  const year = new Date().getFullYear()
  const suffix = String(Math.floor(Math.random() * 9000) + 1000)

  return `ORD-${year}-${suffix}`
}
