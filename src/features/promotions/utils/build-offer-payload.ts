import { getOfferDetailOption } from "../constants"
import type { CreateOfferFormValues } from "../schemas/create-offer.schema"
import type { OfferInput } from "../types"

type BuildOfferInputOptions = {
  isActive?: boolean
}

export function buildOfferInput(
  values: CreateOfferFormValues,
  { isActive = true }: BuildOfferInputOptions = {}
): OfferInput {
  const detail = getOfferDetailOption(values.details)

  if (!detail) {
    throw new Error("Invalid offer details")
  }

  const name = values.promotionName.trim()
  const description = values.promotionDescription.trim()
  const promoCode = values.promoCode.trim().toUpperCase()
  const kitchenId =
    values.restriction === "specific_kitchen" && values.kitchenId
      ? Number(values.kitchenId)
      : null

  return {
    name,
    promotion_name: name,
    description,
    promotion_description: description,
    promo_code: promoCode,
    promotion_code: promoCode,
    discount_type: detail.discountType,
    discount_value: detail.discountValue,
    details: detail.detailsLabel,
    detail: detail.detailsLabel,
    applies_to: "subtotal",
    restriction: values.restriction,
    kitchen_id: kitchenId,
    start_date: values.startDate,
    end_date: values.endDate,
    promo_start: values.startDate,
    promo_end: values.endDate,
    is_active: isActive,
  }
}
