"use server"

import { restaurantServerEndpoints } from "../api/endpoints"
import type { ApiMenuItem, RestaurantActionResult } from "../types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): RestaurantActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function createMenuItemAction(
  formData: FormData
): Promise<RestaurantActionResult<ApiMenuItem>> {
  try {
    const data = await apiServer.post<ApiMenuItem>(
      restaurantServerEndpoints.menuItems,
      formData
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to create menu item")
  }
}

export async function updateMenuItemAction(
  itemId: string,
  formData: FormData
): Promise<RestaurantActionResult<ApiMenuItem>> {
  try {
    const data = await apiServer.post<ApiMenuItem>(
      restaurantServerEndpoints.menuItem(itemId),
      formData
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to update menu item")
  }
}

export async function deleteMenuItemAction(
  itemId: string
): Promise<RestaurantActionResult> {
  try {
    await apiServer.delete(restaurantServerEndpoints.menuItem(itemId))
    return { success: true }
  } catch (error) {
    return toActionError(error, "Failed to delete menu item")
  }
}

export async function toggleMenuItemAvailabilityAction({
  itemId,
  is_available,
  unavailable_today,
  fulfillment_branch_id,
}: {
  itemId: string | number
  is_available: boolean
  unavailable_today?: boolean
  fulfillment_branch_id?: number
}): Promise<RestaurantActionResult<ApiMenuItem>> {
  try {
    const payload =
      fulfillment_branch_id !== undefined
        ? {
            is_available,
            fulfillment_branch_id,
            ...(unavailable_today !== undefined ? { unavailable_today } : {}),
          }
        : {
            is_available,
            ...(unavailable_today !== undefined ? { unavailable_today } : {}),
          }

    const data = await apiServer.patch<ApiMenuItem, typeof payload>(
      restaurantServerEndpoints.menuItemAvailability(itemId),
      payload
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to update item availability")
  }
}
