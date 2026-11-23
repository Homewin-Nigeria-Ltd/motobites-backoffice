import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiCustomerGroup,
  ApiCustomerGroupResponse,
  ApiCustomerGroupsResponse,
  ApiGiftcard,
  ApiGiftcardsResponse,
  ApiOffer,
  ApiOfferDetailData,
  ApiOfferDetailResponse,
  ApiOffersResponse,
  CustomerGroup,
  Giftcard,
  Offer,
  OfferDetail,
  OfferListParams,
} from "../types"
import { mapApiCustomerGroupToCustomerGroup } from "../utils/customer-group"
import { mapApiGiftcardToGiftcard } from "../utils/giftcard"
import { mapApiOfferToOffer } from "../utils/offer"
import { mapApiOfferDetailData } from "../utils/offer-detail"
import { promotionEndpoints } from "./endpoints"
import { promotionKeys } from "./keys"

async function fetchOffers(params: OfferListParams = {}): Promise<Offer[]> {
  const query: Record<string, string> = {
    tab: params.tab ?? "all",
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = String(params.fulfillment_branch_id)
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

async function fetchCustomerGroups(): Promise<CustomerGroup[]> {
  const response = await api.get<
    ApiCustomerGroupsResponse | ApiCustomerGroupsResponse["data"]
  >(promotionEndpoints.customerGroups)

  const groups = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : []

  return groups.map(mapApiCustomerGroupToCustomerGroup)
}

async function fetchCustomerGroup(groupId: string): Promise<CustomerGroup> {
  const response = await api.get<
    ApiCustomerGroupResponse | ApiCustomerGroup | { data: ApiCustomerGroup }
  >(promotionEndpoints.customerGroup(groupId))

  const group =
    response && typeof response === "object" && "data" in response
      ? (response as ApiCustomerGroupResponse | { data: ApiCustomerGroup }).data
      : (response as ApiCustomerGroup)

  if (!group || typeof group !== "object" || group.id == null) {
    throw new Error("Customer group not found")
  }

  return mapApiCustomerGroupToCustomerGroup(group)
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

  customerGroups: () =>
    queryOptions({
      queryKey: promotionKeys.customerGroups(),
      queryFn: () => fetchCustomerGroups(),
    }),

  customerGroup: (groupId: string) =>
    queryOptions({
      queryKey: promotionKeys.customerGroup(groupId),
      queryFn: () => fetchCustomerGroup(groupId),
      enabled: Boolean(groupId),
    }),
}
