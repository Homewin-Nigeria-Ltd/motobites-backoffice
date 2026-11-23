"use server"

import { promotionServerEndpoints } from "../api/endpoints"
import type {
  ApiCustomerGroup,
  CustomerGroup,
  CustomerGroupInput,
  PromotionActionResult,
} from "../types"
import { mapApiCustomerGroupToCustomerGroup } from "../utils/customer-group"
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

export async function createCustomerGroupAction(
  input: CustomerGroupInput
): Promise<PromotionActionResult<CustomerGroup>> {
  try {
    const data = await apiServer.post<ApiCustomerGroup>(
      promotionServerEndpoints.customerGroups,
      input
    )

    return { success: true, data: mapApiCustomerGroupToCustomerGroup(data) }
  } catch (error) {
    return toActionError(error, "Failed to create customer group")
  }
}

export async function updateCustomerGroupAction(
  groupId: string,
  input: CustomerGroupInput
): Promise<PromotionActionResult<CustomerGroup>> {
  if (!groupId.trim()) {
    return { success: false, error: "Customer group is required" }
  }

  try {
    const data = await apiServer.patch<ApiCustomerGroup>(
      promotionServerEndpoints.customerGroup(groupId),
      input
    )

    return { success: true, data: mapApiCustomerGroupToCustomerGroup(data) }
  } catch (error) {
    return toActionError(error, "Failed to update customer group")
  }
}
