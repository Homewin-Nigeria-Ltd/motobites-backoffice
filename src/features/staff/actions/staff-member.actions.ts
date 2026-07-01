"use server"

import { staffEndpoints } from "../api/endpoints"
import type {
  ApiStaffMember,
  InviteStaffInput,
  StaffActionResult,
  UpdateStaffInput,
} from "../types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export async function inviteStaffAction(
  input: InviteStaffInput
): Promise<StaffActionResult<ApiStaffMember>> {
  try {
    const data = await apiServer.post<ApiStaffMember>(staffEndpoints.invite, {
      name: input.name,
      full_name: input.name,
      email: input.email,
      staff_role: input.staff_role,
      fulfillment_branch_id: Number(input.fulfillment_branch_id),
    })

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to invite team member",
      }
    }

    throw error
  }
}

export async function updateStaffAction({
  id,
  ...body
}: UpdateStaffInput): Promise<StaffActionResult<ApiStaffMember>> {
  if (!id.trim()) {
    return { success: false, error: "Team member is required" }
  }

  try {
    const data = await apiServer.patch<ApiStaffMember>(
      staffEndpoints.member(id),
      {
        ...body,
        ...(body.fulfillment_branch_id
          ? { fulfillment_branch_id: Number(body.fulfillment_branch_id) }
          : {}),
      }
    )

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to update team member",
      }
    }

    throw error
  }
}

export async function toggleStaffFavoriteAction(
  id: string
): Promise<StaffActionResult<ApiStaffMember>> {
  if (!id.trim()) {
    return { success: false, error: "Team member is required" }
  }

  try {
    const data = await apiServer.patch<ApiStaffMember>(
      staffEndpoints.favorite(id)
    )

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to update favorite",
      }
    }

    throw error
  }
}

export async function removeStaffAction(
  id: string
): Promise<StaffActionResult> {
  if (!id.trim()) {
    return { success: false, error: "Team member is required" }
  }

  try {
    await apiServer.delete(staffEndpoints.member(id))
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to remove team member",
      }
    }

    throw error
  }
}
