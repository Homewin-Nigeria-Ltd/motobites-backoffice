import type { OfferListParams } from "../types"

export const promotionKeys = {
  all: ["promotions"] as const,
  offers: (params: OfferListParams = {}) =>
    [...promotionKeys.all, "offers", params] as const,
  offer: (offerId: string) => [...promotionKeys.all, "offer", offerId] as const,
  giftCards: () => [...promotionKeys.all, "gift-cards"] as const,
  giftCard: (giftcardId: string) =>
    [...promotionKeys.all, "gift-card", giftcardId] as const,
} as const
