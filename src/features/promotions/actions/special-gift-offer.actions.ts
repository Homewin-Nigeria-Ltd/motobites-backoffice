"use server"

import { promotionServerEndpoints } from "../api/endpoints"
import type {
  ApiSpecialGiftOffer,
  PromotionActionResult,
  SpecialGiftOffer,
  SpecialGiftOfferInput,
} from "../types"
import { mapApiSpecialGiftOfferToSpecialGiftOffer } from "../utils/special-gift-offer"
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

export async function createSpecialGiftOfferAction(
  input: SpecialGiftOfferInput
): Promise<PromotionActionResult<SpecialGiftOffer>> {
  try {
    const data = await apiServer.post<ApiSpecialGiftOffer>(
      promotionServerEndpoints.specialGiftOffers,
      input
    )

    return {
      success: true,
      data: mapApiSpecialGiftOfferToSpecialGiftOffer(data),
    }
  } catch (error) {
    return toActionError(error, "Failed to create special offer")
  }
}

export async function updateSpecialGiftOfferAction(
  offerId: string,
  input: SpecialGiftOfferInput
): Promise<PromotionActionResult<SpecialGiftOffer>> {
  if (!offerId.trim()) {
    return { success: false, error: "Special offer is required" }
  }

  try {
    const data = await apiServer.patch<ApiSpecialGiftOffer>(
      promotionServerEndpoints.specialGiftOffer(offerId),
      input
    )

    return {
      success: true,
      data: mapApiSpecialGiftOfferToSpecialGiftOffer(data),
    }
  } catch (error) {
    return toActionError(error, "Failed to update special offer")
  }
}

export async function deleteSpecialGiftOfferAction(
  offerId: string
): Promise<PromotionActionResult> {
  if (!offerId.trim()) {
    return { success: false, error: "Special offer is required" }
  }

  try {
    await apiServer.delete(promotionServerEndpoints.specialGiftOffer(offerId))
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to delete special offer")
  }
}
