import { api } from "@/lib/api/client"
import type { ApiRider } from "../types"
import { ridersEndpoints } from "./endpoints"

export type RiderMutationApiResponse = {
  success: boolean
  data?: ApiRider
  message?: string
}

export type UpdateRiderInput = {
  riderId: string | number
  formData: FormData
}

export type UpdateRiderStatusInput = {
  riderId: string | number
  onboarding_status: "approved" | "rejected"
  user_status: string
  is_online: boolean
  review_notes?: string
}

export const ridersMutations = {
  create: {
    mutationFn: (formData: FormData) =>
      api.post<RiderMutationApiResponse, FormData>(
        ridersEndpoints.create,
        formData
      ),
  },
  update: {
    mutationFn: ({ riderId, formData }: UpdateRiderInput) =>
      api.post<RiderMutationApiResponse, FormData>(
        ridersEndpoints.update(riderId),
        formData
      ),
  },
  updateStatus: {
    mutationFn: ({ riderId, ...body }: UpdateRiderStatusInput) =>
      api.patch<RiderMutationApiResponse, Omit<UpdateRiderStatusInput, "riderId">>(
        ridersEndpoints.status(riderId),
        body
      ),
  },
} as const
