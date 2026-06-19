"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { ridersKeys } from "../api/keys"
import { ridersMutations } from "../api/mutations"
import type { UpdateRiderFormValues } from "../schemas/add-rider.schema"
import { buildRiderFormData } from "../utils/build-rider-form-data"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateRider() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    ...ridersMutations.update,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ridersKeys.all })
      toast.success(response.message ?? "Rider updated successfully")
      router.push("/riders")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update rider. Please try again."
      toast.error(message)
    },
  })

  return {
    updateRider: (riderId: string | number, values: UpdateRiderFormValues) =>
      mutation.mutateAsync({
        riderId,
        formData: buildRiderFormData(values),
      }),
    isPending: mutation.isPending,
  }
}
