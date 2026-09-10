export function getSalesTransactionStatusBadgeClass(status: string) {
  const normalized = status.toLowerCase()

  if (normalized.includes("pending")) {
    return "bg-amber-100 text-amber-700"
  }

  if (normalized.includes("fail")) {
    return "bg-rose-100 text-rose-700"
  }

  if (normalized.includes("refund")) {
    return "bg-rose-100 text-rose-700"
  }

  return "bg-emerald-100 text-emerald-700"
}
