const ACQUISITION_SOURCE_LABELS: Record<string, string> = {
  meta: "Meta",
  tiktok: "TikTok",
  google: "Google",
  organic: "Organic",
  referral: "Referral",
  walk_in: "Walk-in",
  whatsapp: "WhatsApp",
  glovo: "Glovo",
  chowdeck: "Chowdeck",
}

export function formatCustomerAcquisitionSource(source?: string | null) {
  if (!source) {
    return "—"
  }

  const normalized = source.trim().toLowerCase().replace(/[\s-]+/g, "_")

  if (ACQUISITION_SOURCE_LABELS[normalized]) {
    return ACQUISITION_SOURCE_LABELS[normalized]
  }

  return source
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}
