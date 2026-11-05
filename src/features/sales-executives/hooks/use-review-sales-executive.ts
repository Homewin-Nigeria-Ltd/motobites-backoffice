"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { salesExecutiveKeys } from "../api/keys"
import { salesExecutiveMutations } from "../api/mutations"
import type { ReviewSalesExecutiveInput } from "../types"

export function useReviewSalesExecutive() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...salesExecutiveMutations.review,
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({ queryKey: salesExecutiveKeys.all })
      toast.success(
        input.status === "approved"
          ? "Application approved."
          : "Application rejected."
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not review this application."
      )
    },
  })

  return {
    review: (input: ReviewSalesExecutiveInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
