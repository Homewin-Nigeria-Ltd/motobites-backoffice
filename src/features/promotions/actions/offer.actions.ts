"use server"

import { promotionServerEndpoints } from "../api/endpoints"
import type {
  ApiOffer,
  Offer,
  OfferInput,
  PromotionActionResult,
} from "../types"
import { mapApiOfferToOffer } from "../utils/offer"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(
  error: unknown,
  fallback: string
): PromotionActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function createOfferAction(
  input: OfferInput
): Promise<PromotionActionResult<Offer>> {
  try {
    const data = await apiServer.post<ApiOffer>(
      promotionServerEndpoints.offers,
      input
    )

    return { success: true, data: mapApiOfferToOffer(data) }
  } catch (error) {
    return toActionError(error, "Failed to create promotion")
  }
}

export async function updateOfferAction(
  offerId: string,
  input: OfferInput
): Promise<PromotionActionResult<Offer>> {
  if (!offerId.trim()) {
    return { success: false, error: "Offer is required" }
  }

  try {
    const data = await apiServer.patch<ApiOffer>(
      promotionServerEndpoints.offer(offerId),
      input
    )

    return { success: true, data: mapApiOfferToOffer(data) }
  } catch (error) {
    return toActionError(error, "Failed to update promotion")
  }
}
