import type { SpecialGiftOfferFormValues } from "../schemas/special-gift-offer-form.schema"
import type { SpecialGiftOffer } from "../types"

function toDateInput(value: string) {
  if (!value) return ""
  return value.includes("T") ? value.slice(0, 10) : value
}

export function mapSpecialGiftOfferToFormValues(
  offer: SpecialGiftOffer
): SpecialGiftOfferFormValues {
  return {
    name: offer.name,
    minimumBasketValue: offer.minimumBasketValue || 10000,
    giftMenuItemId: offer.giftMenuItemId,
    giftQuantity: offer.giftQuantity || 1,
    startsAt: toDateInput(offer.startsAt),
    endsAt: toDateInput(offer.endsAt),
    isActive: offer.isActive,
  }
}
