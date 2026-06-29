import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiGiftcard,
  ApiGiftcardsResponse,
  ApiOffer,
  ApiOfferDetailData,
  ApiOfferDetailResponse,
  ApiOffersResponse,
  Giftcard,
  Offer,
  OfferDetail,
  OfferListParams,
} from "../types"
import { mapApiGiftcardToGiftcard } from "../utils/giftcard"
import { mapApiOfferToOffer } from "../utils/offer"
import { mapApiOfferDetailData } from "../utils/offer-detail"
import { promotionEndpoints } from "./endpoints"
import { promotionKeys } from "./keys"

async function fetchOffers(params: OfferListParams = {}): Promise<Offer[]> {
  const query: Record<string, string> = {
    tab: params.tab ?? "all",
  }

  const response = await api.get<ApiOffersResponse>(
    promotionEndpoints.offers,
    query
  )

  return response.data.map(mapApiOfferToOffer)
}

async function fetchOfferDetailData(offerId: string): Promise<ApiOfferDetailData> {
  const response = await api.get<ApiOfferDetailResponse>(
    promotionEndpoints.offer(offerId)
  )

  return response.data
}

async function fetchApiOffer(offerId: string): Promise<ApiOffer> {
  const data = await fetchOfferDetailData(offerId)
  return data.offer
}

async function fetchOfferDetail(offerId: string): Promise<OfferDetail> {
  const data = await fetchOfferDetailData(offerId)
  return mapApiOfferDetailData(data)
}

async function fetchGiftcards(): Promise<Giftcard[]> {
  const response = await api.get<ApiGiftcardsResponse>(
    promotionEndpoints.giftCards
  )

  return response.data.map(mapApiGiftcardToGiftcard)
}

async function fetchApiGiftcard(giftcardId: string): Promise<ApiGiftcard> {
  const response = await api.get<ApiGiftcardsResponse>(
    promotionEndpoints.giftCards
  )

  const giftcard = response.data.find(
    (item) => String(item.id) === giftcardId
  )

  if (!giftcard) {
    throw new Error("Gift card not found")
  }

  return giftcard
}

export const promotionQueries = {
  offers: (params: OfferListParams = {}) =>
    queryOptions({
      queryKey: promotionKeys.offers(params),
      queryFn: () => fetchOffers(params),
      placeholderData: (previous) => previous,
    }),

  offer: (offerId: string) =>
    queryOptions({
      queryKey: promotionKeys.offer(offerId),
      queryFn: () => fetchOfferDetail(offerId),
      enabled: Boolean(offerId),
    }),

  apiOffer: (offerId: string) =>
    queryOptions({
      queryKey: [...promotionKeys.offer(offerId), "api"] as const,
      queryFn: () => fetchApiOffer(offerId),
      enabled: Boolean(offerId),
    }),

  giftCards: () =>
    queryOptions({
      queryKey: promotionKeys.giftCards(),
      queryFn: () => fetchGiftcards(),
    }),

  apiGiftcard: (giftcardId: string) =>
    queryOptions({
      queryKey: [...promotionKeys.giftCard(giftcardId), "api"] as const,
      queryFn: () => fetchApiGiftcard(giftcardId),
      enabled: Boolean(giftcardId),
    }),
}
