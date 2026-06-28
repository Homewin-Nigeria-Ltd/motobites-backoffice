"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { inventoryMutations } from "../api/mutations"
import { inventoryKeys } from "../api/keys"
import { toast } from "@/lib/toast"

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...inventoryMutations.createItem,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
      toast.success("Item added successfully")
    },
    onError: () => {
      toast.error("Failed to add inventory item. Please try again.")
    },
  })

  return {
    createItem: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...inventoryMutations.updateItem,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
      toast.success("Item updated successfully")
    },
    onError: () => {
      toast.error("Failed to update inventory item. Please try again.")
    },
  })

  return {
    updateItem: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
