export function getSalesTransactionSourceBadgeClass(source: string) {
  const normalized = source.toLowerCase()

  if (normalized.includes("whatsapp")) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (normalized.includes("glovo")) {
    return "bg-amber-100 text-amber-700"
  }

  if (normalized.includes("chowdeck")) {
    return "bg-rose-100 text-rose-700"
  }

  if (normalized.includes("web")) {
    return "bg-sky-100 text-sky-700"
  }

  return "bg-primary/10 text-primary"
}
