"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { restaurantKeys } from "../api/keys"
import { restaurantMutations } from "../api/mutations"
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
    onSuccess: (result, { itemId, is_available }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: restaurantKeys.menuItems })
      queryClient.invalidateQueries({
        queryKey: restaurantKeys.menuItemDetail(String(itemId)),
      })
      toast.success(
        is_available ? "Item marked as available" : "Item marked as unavailable"
      )
    },
    onError: () => {
      toast.error("Failed to update item availability. Please try again.")
    },
  })

  return {
    toggleAvailability: mutation.mutate,
    isPending: mutation.isPending,
    pendingItemId: mutation.isPending
      ? String(mutation.variables?.itemId ?? "")
      : null,
  }
}
