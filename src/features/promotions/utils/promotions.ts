import type { Offer, OfferTab } from "@/features/promotions/types"

export function filterOffers(
  offers: Offer[],
  tab: OfferTab,
  search: string
): Offer[] {
  const normalizedSearch = search.trim().toLowerCase()

  return offers.filter((offer) => {
    const matchesTab =
      tab === "all" ? true : offer.status === tab

    if (!matchesTab) return false

    if (!normalizedSearch) return true

    return (
      offer.title.toLowerCase().includes(normalizedSearch) ||
      offer.description.toLowerCase().includes(normalizedSearch)
    )
  })
}

export function formatGiftcardAmount(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG")}`
}
