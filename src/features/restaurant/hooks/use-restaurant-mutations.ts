"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { restaurantKeys } from "../api/keys"
import { restaurantMutations } from "../api/mutations"
import type { ApiMenuItemDetail } from "../types"
import { mergeBranchAvailability } from "../utils/menu-item-branch-availability"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useCreateKitchen() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.createKitchen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all })
      toast.success("Kitchen created")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to create kitchen. Please try again."
      toast.error(message)
    },
  })

  return {
    createKitchen: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateKitchen() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.updateKitchen,
    onSuccess: (_data, { kitchenId }) => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all })
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.detail(kitchenId),
      })
      toast.success("Kitchen updated")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update kitchen. Please try again."
      toast.error(message)
    },
  })

  return {
    updateKitchen: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.createMenuItem,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems })
      toast.success("Menu item created")
    },
    onError: () => {
      toast.error("Failed to create menu item. Please try again.")
    },
  })

  return {
    createMenuItem: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.updateMenuItem,
    onSuccess: (result, { itemId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems })
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.menuItemDetail(itemId),
      })
      toast.success("Menu item updated")
    },
    onError: () => {
      toast.error("Failed to update menu item. Please try again.")
    },
  })

  return {
    updateMenuItem: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.deleteMenuItem,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems })
      toast.success("Menu item deleted")
    },
    onError: () => {
      toast.error("Failed to delete menu item. Please try again.")
    },
  })

  return {
    deleteMenuItem: mutation.mutateAsync,
    isPending: mutation.isPending,
    pendingItemId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useToggleMenuItemAvailability() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...restaurantMutations.toggleMenuItemAvailability,
    onSuccess: (
      result,
      { itemId, is_available, unavailable_today, fulfillment_branch_id }
    ) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      const itemKey = String(itemId)
      const updatedItem = result.data

      queryClient.setQueryData<ApiMenuItemDetail>(
        restaurantKeys.menuItemDetail(itemKey),
        (old) => {
          if (!old) {
            return old
          }

          if (fulfillment_branch_id === undefined) {
            return {
              ...old,
              is_available,
              is_customer_available: updatedItem?.is_customer_available ?? is_available,
              unavailable_today:
                unavailable_today ?? updatedItem?.unavailable_today ?? false,
              branch_availability: updatedItem?.branch_availability ?? old.branch_availability,
            }
          }

          return {
            ...old,
            branch_availability: updatedItem?.branch_availability ??
              mergeBranchAvailability(
                old.branch_availability,
                fulfillment_branch_id,
                is_available
              ),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems })
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.menuItemDetail(itemKey),
      })

      if (fulfillment_branch_id === undefined) {
        toast.success(
          is_available ? "Item marked as available" : "Item marked as unavailable"
        )
        return
      }

      toast.success(
        is_available
          ? "Item marked as available for this branch"
          : "Item marked as unavailable for this branch"
      )
    },
    onError: () => {
      toast.error("Failed to update item availability. Please try again.")
    },
  })

  const pendingItemId =
    mutation.isPending &&
    mutation.variables &&
    mutation.variables.fulfillment_branch_id === undefined
      ? String(mutation.variables.itemId)
      : null

  const pendingBranchKey =
    mutation.isPending &&
    mutation.variables &&
    mutation.variables.fulfillment_branch_id !== undefined
      ? `${mutation.variables.itemId}:${mutation.variables.fulfillment_branch_id}`
      : null

  return {
    toggleAvailability: mutation.mutate,
    isPending: mutation.isPending,
    pendingItemId,
    pendingBranchKey,
  }
}
