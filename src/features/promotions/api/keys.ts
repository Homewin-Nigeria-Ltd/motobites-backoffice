import type { OfferListParams } from "../types"

export const promotionKeys = {
  all: ["promotions"] as const,
  offers: (params: OfferListParams = {}) =>
    [...promotionKeys.all, "offers", params] as const,
  offer: (offerId: string) => [...promotionKeys.all, "offer", offerId] as const,
  giftCards: () => [...promotionKeys.all, "gift-cards"] as const,
  giftCard: (giftcardId: string) =>
    [...promotionKeys.all, "gift-card", giftcardId] as const,
  customerGroups: () => [...promotionKeys.all, "customer-groups"] as const,
  customerGroup: (groupId: string) =>
    [...promotionKeys.all, "customer-group", groupId] as const,
} as const
