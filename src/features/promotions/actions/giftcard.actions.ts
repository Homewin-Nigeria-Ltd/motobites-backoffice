"use server"

import { promotionServerEndpoints } from "../api/endpoints"
import type {
  ApiGiftcard,
  Giftcard,
  PromotionActionResult,
} from "../types"
import { mapApiGiftcardToGiftcard } from "../utils/giftcard"
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

export async function createGiftcardAction(
  formData: FormData
): Promise<PromotionActionResult<Giftcard>> {
  try {
    const data = await apiServer.post<ApiGiftcard>(
      promotionServerEndpoints.giftCards,
      formData
    )

    return { success: true, data: mapApiGiftcardToGiftcard(data) }
  } catch (error) {
    return toActionError(error, "Failed to create gift card")
  }
}

export async function updateGiftcardAction(
  giftcardId: string,
  formData: FormData
): Promise<PromotionActionResult<Giftcard>> {
  if (!giftcardId.trim()) {
    return { success: false, error: "Gift card is required" }
  }

  try {
    const data = await apiServer.patch<ApiGiftcard>(
      promotionServerEndpoints.giftCard(giftcardId),
      formData
    )

    return { success: true, data: mapApiGiftcardToGiftcard(data) }
  } catch (error) {
    return toActionError(error, "Failed to update gift card")
  }
}
