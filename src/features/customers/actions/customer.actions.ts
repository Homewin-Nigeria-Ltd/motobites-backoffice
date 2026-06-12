"use server"

import { customerEndpoints } from "../api/endpoints"
import type {
  ApiCustomer,
  CustomerActionResult,
  IncreaseCnplEligibilityInput,
} from "../types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export async function deleteCustomerAction(
  id: string
): Promise<CustomerActionResult> {
  if (!id.trim()) {
    return { success: false, error: "Customer is required" }
  }

  try {
    await apiServer.delete(customerEndpoints.member(id))
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to delete customer account",
      }
    }

    throw error
  }
}

export async function suspendCustomerAction(
  id: string
): Promise<CustomerActionResult<ApiCustomer>> {
  if (!id.trim()) {
    return { success: false, error: "Customer is required" }
  }

  try {
    const data = await apiServer.post<ApiCustomer>(customerEndpoints.suspend(id))

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to suspend customer account",
      }
    }

    throw error
  }
}

export async function deactivateCustomerAction(
  id: string
): Promise<CustomerActionResult<ApiCustomer>> {
  if (!id.trim()) {
    return { success: false, error: "Customer is required" }
  }

  try {
    const data = await apiServer.post<ApiCustomer>(
      customerEndpoints.deactivate(id)
    )

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to deactivate customer account",
      }
    }

    throw error
  }
}

export async function increaseCnplEligibilityAction({
  id,
  amount,
}: IncreaseCnplEligibilityInput): Promise<CustomerActionResult> {
  if (!id.trim()) {
    return { success: false, error: "Customer is required" }
  }

  try {
    await apiServer.post(customerEndpoints.increaseCnplEligibility(id), {
      amount,
    })

    return {
      success: true,
      message: "CNPL eligibility limit increased",
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to increase CNPL eligibility limit",
      }
    }

    throw error
  }
}
