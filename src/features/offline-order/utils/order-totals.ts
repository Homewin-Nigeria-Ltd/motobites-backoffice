import { WALK_IN_SERVICE_FEE } from "../constants"

export function calculateOfflineOrderTotals(subtotal: number) {
  const serviceFee = WALK_IN_SERVICE_FEE
  const total = subtotal + serviceFee

  return { subtotal, serviceFee, total }
}

export function formatOfflineOrderAmount(amount?: number | null) {
  const value = amount ?? 0
  return `₦${value.toLocaleString()}`
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
