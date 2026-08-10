"use server"

import { restaurantServerEndpoints } from "../api/endpoints"
import type {
  ApiFulfillmentBranch,
  CreateFulfillmentBranchInput,
  RestaurantActionResult,
  UpdateFulfillmentBranchInput,
} from "../types"
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

export async function createFulfillmentBranchAction(
  input: CreateFulfillmentBranchInput,
): Promise<RestaurantActionResult<ApiFulfillmentBranch>> {
  try {
    const data = await apiServer.post<ApiFulfillmentBranch>(
      restaurantServerEndpoints.fulfillmentBranches,
      input,
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to create branch")
  }
}

export async function updateFulfillmentBranchAction({
  id,
  ...input
}: UpdateFulfillmentBranchInput): Promise<
  RestaurantActionResult<ApiFulfillmentBranch>
> {
  if (id === "" || id === null || id === undefined) {
    return { success: false, error: "Branch is required" }
  }

  try {
    const data = await apiServer.put<ApiFulfillmentBranch>(
      restaurantServerEndpoints.fulfillmentBranch(id),
      input,
    )

    return { success: true, data }
  } catch (error) {
    return toActionError(error, "Failed to update branch")
  }
}
