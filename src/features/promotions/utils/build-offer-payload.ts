import {
  formatFlatOfferDetails,
  getOfferDetailOption,
} from "../constants"
import type { CreateOfferFormValues } from "../schemas/create-offer.schema"
import type { OfferInput } from "../types"

type BuildOfferInputOptions = {
  isActive?: boolean
}

export function buildOfferInput(
  values: CreateOfferFormValues,
  { isActive = true }: BuildOfferInputOptions = {}
): OfferInput {
  const name = values.promotionName.trim()
  const description = values.promotionDescription.trim()
  const promoCode = values.promoCode.trim().toUpperCase()
  const kitchenId =
    values.restriction === "specific_kitchen" && values.kitchenId
      ? Number(values.kitchenId)
      : null

  const discount =
    values.discountMode === "flat"
      ? {
          discount_type: "flat_amount" as const,
          discount_value: Math.round(Number(values.flatAmount) * 100),
          details: formatFlatOfferDetails(Number(values.flatAmount)),
        }
      : (() => {
          const detail = getOfferDetailOption(values.details)

          if (!detail) {
            throw new Error("Invalid offer details")
          }

          return {
            discount_type: detail.discountType,
            discount_value: detail.discountValue,
            details: detail.detailsLabel,
          }
        })()

  return {
    name,
    promotion_name: name,
    description,
    promotion_description: description,
    promo_code: promoCode,
    promotion_code: promoCode,
    discount_type: discount.discount_type,
    discount_value: discount.discount_value,
    details: discount.details,
    detail: discount.details,
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
