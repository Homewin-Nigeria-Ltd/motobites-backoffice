"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { ridersKeys } from "../api/keys"
import { ridersMutations } from "../api/mutations"
import type { AddRiderFormValues } from "../schemas/add-rider.schema"
import { buildRiderFormData } from "../utils/build-rider-form-data"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useCreateRider() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    ...ridersMutations.create,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ridersKeys.all })
      toast.success(response.message ?? "Rider saved and published")
      router.push("/riders")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save rider. Please try again."
      toast.error(message)
    },
  })

  return {
    createRider: (values: AddRiderFormValues) =>
      mutation.mutateAsync(buildRiderFormData(values)),
    isPending: mutation.isPending,
  }
}
