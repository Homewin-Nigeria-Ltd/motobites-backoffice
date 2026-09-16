import { ApiError, api } from "@/lib/api/client"

import {
  deleteMenuItemAction,
  deleteMenuItemImageAction,
  deleteMenuItemVideoAction,
  toggleMenuItemAvailabilityAction,
} from "../actions/menu-item.actions"
import { createFulfillmentBranchAction, updateFulfillmentBranchAction } from "../actions/fulfillment-branch.actions"
import type {
  ApiMenuItem,
  CreateFulfillmentBranchInput,
  KitchenMutationResponse,
  MenuItemMutationResponse,
  RestaurantActionResult,
  UpdateFulfillmentBranchInput,
} from "../types"
import { restaurantEndpoints } from "./endpoints"

export type ToggleMenuItemAvailabilityInput = {
  itemId: string | number
  is_available: boolean
  unavailable_today?: boolean
  fulfillment_branch_id?: number
}

export const restaurantMutations = {
  createKitchen: {
    mutationFn: (formData: FormData) =>
      api
        .post<KitchenMutationResponse, FormData>(
          restaurantEndpoints.kitchens,
          formData
        )
        .then((response) => response.data),
  },

  updateKitchen: {
    mutationFn: ({
      kitchenId,
      formData,
    }: {
      kitchenId: string
      formData: FormData
    }) =>
      api
        .post<KitchenMutationResponse, FormData>(
          restaurantEndpoints.kitchen(kitchenId),
          formData
        )
        .then((response) => response.data),
  },

  createMenuItem: {
    mutationFn: async (
      formData: FormData
    ): Promise<RestaurantActionResult<ApiMenuItem>> => {
      try {
        const response = await api.post<MenuItemMutationResponse, FormData>(
          restaurantEndpoints.menuItems,
          formData
        )
        return { success: true, data: response.data }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to create menu item"
        return { success: false, error: message }
      }
    },
  },

  updateMenuItem: {
    mutationFn: async ({
      itemId,
      formData,
    }: {
      itemId: string
      formData: FormData
    }): Promise<RestaurantActionResult<ApiMenuItem>> => {
      try {
        const response = await api.post<MenuItemMutationResponse, FormData>(
          restaurantEndpoints.menuItem(itemId),
          formData
        )
        return { success: true, data: response.data }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to update menu item"
        return { success: false, error: message }
      }
    },
  },

  deleteMenuItem: {
    mutationFn: (itemId: string) => deleteMenuItemAction(itemId),
  },

  deleteMenuItemImage: {
    mutationFn: ({
      itemId,
      imageId,
    }: {
      itemId: string | number
      imageId: string | number
    }) => deleteMenuItemImageAction(itemId, imageId),
  },

  deleteMenuItemVideo: {
    mutationFn: ({
      itemId,
      videoId,
    }: {
      itemId: string | number
      videoId: string | number
    }) => deleteMenuItemVideoAction(itemId, videoId),
  },

  toggleMenuItemAvailability: {
    mutationFn: (input: ToggleMenuItemAvailabilityInput) =>
      toggleMenuItemAvailabilityAction(input),
  },

  createFulfillmentBranch: {
    mutationFn: (input: CreateFulfillmentBranchInput) =>
      createFulfillmentBranchAction(input),
  },

  updateFulfillmentBranch: {
    mutationFn: (input: UpdateFulfillmentBranchInput) =>
      updateFulfillmentBranchAction(input),
  },
} as const
