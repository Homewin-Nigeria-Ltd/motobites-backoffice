import type { Offer } from "@/features/promotions/types"

export function filterOffers(offers: Offer[], search: string): Offer[] {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return offers
  }

  return offers.filter((offer) => {
    return (
      offer.title.toLowerCase().includes(normalizedSearch) ||
      offer.description.toLowerCase().includes(normalizedSearch) ||
      offer.promoCode.toLowerCase().includes(normalizedSearch) ||
      offer.detailsLabel.toLowerCase().includes(normalizedSearch) ||
      offer.restrictionLabel.toLowerCase().includes(normalizedSearch)
    )
  })
}

export function formatGiftcardAmount(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG")}`
}
