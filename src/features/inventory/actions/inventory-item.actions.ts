"use server"

import { inventoryServerEndpoints } from "../api/endpoints"
import type { ApiInventoryItem, InventoryActionResult } from "../types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(
  error: unknown,
  fallback: string
): InventoryActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

export async function createInventoryItemAction(
  formData: FormData
): Promise<InventoryActionResult<ApiInventoryItem>> {
  try {
    const data = await apiServer.post<ApiInventoryItem>(
      inventoryServerEndpoints.items,
      formData
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to add inventory item")
  }
}

export async function updateInventoryItemAction(
  itemId: number,
  formData: FormData
): Promise<InventoryActionResult<ApiInventoryItem>> {
  try {
    const data = await apiServer.put<ApiInventoryItem>(
      inventoryServerEndpoints.item(itemId),
      formData
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to update inventory item")
  }
}
