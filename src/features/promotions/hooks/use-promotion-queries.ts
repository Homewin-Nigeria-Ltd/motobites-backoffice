"use client"

import { useQuery } from "@tanstack/react-query"

import { promotionQueries } from "../api/queries"
import type { OfferListParams } from "../types"

export function usePromotionOffers(params: OfferListParams = {}) {
  return useQuery(promotionQueries.offers(params))
}

export function usePromotionOffer(offerId: string) {
  return useQuery(promotionQueries.offer(offerId))
}

export function useGiftcards() {
  return useQuery(promotionQueries.giftCards())
}

export function useCustomerGroups() {
  return useQuery(promotionQueries.customerGroups())
}

export function useCustomerGroup(groupId: string, enabled = true) {
  return useQuery({
    ...promotionQueries.customerGroup(groupId),
    enabled: Boolean(groupId) && enabled,
  })
}

export function useSpecialGiftOffers() {
  return useQuery(promotionQueries.specialGiftOffers())
}
