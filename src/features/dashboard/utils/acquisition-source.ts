import type { DashboardAcquisitionSource } from "@/features/dashboard/types"

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

export function formatAcquisitionSourceLabel(source?: string | null) {
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

export function formatPreferredPaymentMethod(method?: string | null) {
  if (!method) {
    return "—"
  }

  return method
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getAcquisitionSourceCount(entry: DashboardAcquisitionSource) {
  return entry.customers ?? entry.count ?? entry.total ?? 0
}

export function normalizeAcquisitionSources(
  sources: DashboardAcquisitionSource[] | Record<string, number>,
) {
  if (Array.isArray(sources)) {
    return sources.map((entry) => ({
      source: entry.source,
      label: entry.label ?? formatAcquisitionSourceLabel(entry.source),
      count: getAcquisitionSourceCount(entry),
      percentage: entry.percentage,
    }))
  }

  return Object.entries(sources).map(([source, count]) => ({
    source,
    label: formatAcquisitionSourceLabel(source),
    count,
    percentage: undefined as number | undefined,
  }))
}
