"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { promotionMutations } from "../api/mutations"
import { promotionKeys } from "../api/keys"
import { toast } from "@/lib/toast"

export function useCreateOffer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...promotionMutations.createOffer,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: promotionKeys.all })
      toast.success("Promotion created successfully")
    },
    onError: () => {
      toast.error("Failed to create promotion. Please try again.")
    },
  })

  return {
    createOffer: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateOffer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...promotionMutations.updateOffer,
    onSuccess: (result, { offerId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(promotionKeys.offer(offerId), result.data)
      }

      void queryClient.invalidateQueries({ queryKey: promotionKeys.all })
      toast.success("Promotion updated successfully")
    },
    onError: () => {
      toast.error("Failed to update promotion. Please try again.")
    },
  })

  return {
    updateOffer: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useCreateGiftcard() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...promotionMutations.createGiftcard,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: promotionKeys.all })
      toast.success("Gift card created successfully")
    },
    onError: () => {
      toast.error("Failed to create gift card. Please try again.")
    },
  })

  return {
    createGiftcard: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateGiftcard() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...promotionMutations.updateGiftcard,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: promotionKeys.all })
      toast.success("Gift card updated successfully")
    },
    onError: () => {
      toast.error("Failed to update gift card. Please try again.")
    },
  })

  return {
    updateGiftcard: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
