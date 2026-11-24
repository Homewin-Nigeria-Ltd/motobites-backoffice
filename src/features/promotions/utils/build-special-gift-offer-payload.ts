import type { SpecialGiftOfferFormValues } from "../schemas/special-gift-offer-form.schema"
import type { SpecialGiftOfferInput } from "../types"

function toStartIso(date: string) {
  if (date.includes("T")) return date
  return `${date}T00:00:00Z`
}

function toEndIso(date: string) {
  if (date.includes("T")) return date
  return `${date}T23:59:59Z`
}

export function buildSpecialGiftOfferInput(
  values: SpecialGiftOfferFormValues
): SpecialGiftOfferInput {
  return {
    name: values.name.trim(),
    minimum_basket_value: Number(values.minimumBasketValue),
    gift_menu_item_id: Number(values.giftMenuItemId),
    gift_quantity: Number(values.giftQuantity),
    starts_at: toStartIso(values.startsAt),
    ends_at: toEndIso(values.endsAt),
    is_active: values.isActive,
  }
}
