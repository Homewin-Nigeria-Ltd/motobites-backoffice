import {
  getOfferDetailOptionByDiscount,
  offerRestrictionOptions,
} from "../constants"
import type { CreateOfferFormValues } from "../schemas/create-offer.schema"
import type { ApiOffer } from "../types"

function resolveOfferDescription(offer: ApiOffer) {
  const description = offer.promotion_description || offer.description

  if (description && description !== "string") {
    return description
  }

  return offer.details_label || offer.details || offer.detail || ""
}

export function mapApiOfferToFormValues(offer: ApiOffer): CreateOfferFormValues {
  const detailOption = getOfferDetailOptionByDiscount(
    offer.discount_type,
    offer.discount_value
  )
  const restriction = offerRestrictionOptions.some(
    (option) => option.value === offer.restriction
  )
    ? (offer.restriction as CreateOfferFormValues["restriction"])
    : offer.kitchen_id
      ? "specific_kitchen"
      : "all_kitchen"

  return {
    promotionName: offer.promotion_name || offer.name || offer.title,
    promotionDescription: resolveOfferDescription(offer),
    details: detailOption?.value ?? "percentage:20",
    startDate: offer.start_date || offer.promo_start,
    endDate: offer.end_date || offer.promo_end,
    promoCode: offer.promo_code || offer.promotion_code || offer.code,
    restriction,
    kitchenId: offer.kitchen_id != null ? String(offer.kitchen_id) : "",
  }
}
