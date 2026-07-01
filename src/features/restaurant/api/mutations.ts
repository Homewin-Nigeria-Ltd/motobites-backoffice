import { api } from "@/lib/api/client"

import {
  createMenuItemAction,
  deleteMenuItemAction,
  toggleMenuItemAvailabilityAction,
  updateMenuItemAction,
} from "../actions/menu-item.actions"
import type {
  KitchenMutationResponse,
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
    mutationFn: (formData: FormData) => createMenuItemAction(formData),
  },

  updateMenuItem: {
    mutationFn: ({
      itemId,
      formData,
    }: {
      itemId: string
      formData: FormData
    }) => updateMenuItemAction(itemId, formData),
  },

  deleteMenuItem: {
    mutationFn: (itemId: string) => deleteMenuItemAction(itemId),
  },

  toggleMenuItemAvailability: {
    mutationFn: (input: ToggleMenuItemAvailabilityInput) =>
      toggleMenuItemAvailabilityAction(input),
  },
} as const
