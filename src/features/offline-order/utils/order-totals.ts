import { WALK_IN_SERVICE_FEE } from "../constants"

export function calculateOfflineOrderTotals(subtotal: number) {
  const serviceFee = WALK_IN_SERVICE_FEE
  const total = subtotal + serviceFee

  return { subtotal, serviceFee, total }
}

export function formatOfflineOrderAmount(amount: number) {
  return `₦${amount.toLocaleString()}`
}

export function generateOfflineOrderNumber() {
  const year = new Date().getFullYear()
  const suffix = String(Math.floor(Math.random() * 9000) + 1000)

  return `ORD-${year}-${suffix}`
}
