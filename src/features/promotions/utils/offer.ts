import type { ApiOffer, Offer, OfferStatus } from "../types"

const offerStatuses: OfferStatus[] = ["active", "inactive", "expired"]

function normalizeOfferStatus(status: string): OfferStatus {
  if (offerStatuses.includes(status as OfferStatus)) {
    return status as OfferStatus
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
    status: normalizeOfferStatus(offer.status),
    promoCode: offer.promo_code || offer.code || offer.promotion_code,
    detailsLabel: offer.details_label || offer.details || offer.detail,
    restrictionLabel: offer.restriction_label,
    startDate: offer.start_date || offer.promo_start,
    endDate: offer.end_date || offer.promo_end,
    statusLabel: offer.status_label,
  }
}
