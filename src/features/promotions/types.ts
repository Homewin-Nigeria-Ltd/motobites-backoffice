export type OfferTab = "all" | "active" | "inactive" | "expired"

export type OfferStatus = "active" | "inactive" | "expired"

export type Offer = {
  id: string
  title: string
  description: string
  status: OfferStatus
}

export type GiftcardTheme = "friendship" | "birthday" | "love"

export type Giftcard = {
  id: string
  theme: GiftcardTheme
  label: string
  amount: number
}
