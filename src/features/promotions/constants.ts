export const PROMOTIONS_ROUTES = {
  list: "/promotions",
  create: "/promotions/offers/new",
  detail: (offerId: string | number) =>
    `/promotions/offers/${encodeURIComponent(String(offerId))}`,
  edit: (offerId: string | number) =>
    `/promotions/offers/${encodeURIComponent(String(offerId))}/edit`,
  createGiftcard: "/promotions/giftcards/new",
  editGiftcard: (giftcardId: string | number) =>
    `/promotions/giftcards/${encodeURIComponent(String(giftcardId))}/edit`,
} as const

export const giftcardCategoryOptions = [
  { value: "birthday", label: "Birthday" },
  { value: "friendship", label: "Friendship" },
  { value: "love", label: "Love" },
] as const

export type GiftcardCategory =
  (typeof giftcardCategoryOptions)[number]["value"]

export const offerRestrictionOptions = [
  { value: "all_kitchen", label: "All Kitchen" },
  { value: "specific_kitchen", label: "Specific Kitchen" },
] as const

export type OfferRestriction =
  (typeof offerRestrictionOptions)[number]["value"]

export const offerDetailOptions = [
  {
    value: "percentage:10",
    label: "10% off",
    detailsLabel: "10% of",
    discountType: "percentage",
    discountValue: 10,
  },
  {
    value: "percentage:15",
    label: "15% off",
    detailsLabel: "15% of",
    discountType: "percentage",
    discountValue: 15,
  },
  {
    value: "percentage:20",
    label: "20% off",
    detailsLabel: "20% of",
    discountType: "percentage",
    discountValue: 20,
  },
  {
    value: "percentage:25",
    label: "25% off",
    detailsLabel: "25% of",
    discountType: "percentage",
    discountValue: 25,
  },
  {
    value: "percentage:30",
    label: "30% off",
    detailsLabel: "30% of",
    discountType: "percentage",
    discountValue: 30,
  },
] as const

export type OfferDetailValue = (typeof offerDetailOptions)[number]["value"]

export function getOfferDetailOption(value: string) {
  return offerDetailOptions.find((option) => option.value === value)
}

export function getOfferDetailOptionByDiscount(
  discountType: string,
  discountValue: number
) {
  return offerDetailOptions.find(
    (option) =>
      option.discountType === discountType &&
      option.discountValue === discountValue
  )
}
