import type { ApiOffer, Offer, OfferStatus } from "../types"

const offerStatuses: OfferStatus[] = [
  "active",
  "inactive",
  "paused",
  "expired",
]

function normalizeOfferStatus(
  status: string,
  offer?: Pick<ApiOffer, "is_active" | "is_paused">
): OfferStatus {
  const normalized = (status || "").toLowerCase()
  if (offerStatuses.includes(normalized as OfferStatus)) {
    return normalized as OfferStatus
  }

  if (offer?.is_paused) {
    return "paused"
  }

  if (offer?.is_active) {
    return "active"
  }

  return "inactive"
}

function resolveOfferDescription(offer: ApiOffer) {
  const description = offer.promotion_description || offer.description

  if (description && description !== "string") {
    return description
  }

  return offer.details_label || offer.details || offer.detail || ""
}

export function mapApiOfferToOffer(offer: ApiOffer): Offer {
  return {
    id: String(offer.id),
    title: offer.title || offer.name || offer.promotion_name,
    description: resolveOfferDescription(offer),
    status: normalizeOfferStatus(offer.status, offer),
    promoCode: offer.promo_code || offer.code || offer.promotion_code,
    detailsLabel: offer.details_label || offer.details || offer.detail,
    restrictionLabel: offer.restriction_label,
    startDate: offer.start_date || offer.promo_start,
    endDate: offer.end_date || offer.promo_end,
    statusLabel: offer.status_label,
    usageCount:
      offer.total_uses ??
      offer.usage_count ??
      offer.times_used ??
      0,
  }
}
