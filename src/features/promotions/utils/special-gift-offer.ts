import type { ApiSpecialGiftOffer, SpecialGiftOffer } from "../types"

function toDateLabel(value?: string | null) {
  if (!value) return ""
  return value.includes("T") ? value.slice(0, 10) : value
}

export function mapApiSpecialGiftOfferToSpecialGiftOffer(
  offer: ApiSpecialGiftOffer
): SpecialGiftOffer {
  const isActive = Boolean(offer.is_active)
  const gift = offer.gift ?? offer.gift_menu_item
  const giftMenuItemId = String(
    offer.gift_menu_item_id ?? gift?.id ?? ""
  )
  const giftMenuItemName = gift?.name?.trim() || "—"
  const statusLabel =
    offer.status_label?.trim() ||
    offer.status?.trim() ||
    (isActive ? "Active" : "Inactive")

  return {
    id: String(offer.id),
    name: offer.name?.trim() || "Special offer",
    minimumBasketValue: Number(offer.minimum_basket_value ?? 0),
    giftMenuItemId,
    giftMenuItemName,
    giftQuantity: Number(offer.gift_quantity ?? 1),
    startsAt: offer.starts_at?.trim() || "",
    endsAt: offer.ends_at?.trim() || "",
    isActive,
    status: statusLabel.toLowerCase(),
    statusLabel,
  }
}

export function formatSpecialOfferDateRange(startsAt: string, endsAt: string) {
  const start = toDateLabel(startsAt)
  const end = toDateLabel(endsAt)

  if (start && end) return `${start} → ${end}`
  if (start) return `From ${start}`
  if (end) return `Until ${end}`
  return "No dates set"
}
