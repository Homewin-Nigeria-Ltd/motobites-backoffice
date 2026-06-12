"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { customerKeys } from "../api/keys"
import { customerMutations } from "../api/mutations"
import { toast } from "@/lib/toast"

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...customerMutations.delete,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(result.message ?? "Customer account deleted")
    },
    onError: () => {
      toast.error("Failed to delete customer account")
    },
  })

  return {
    deleteCustomer: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
    pendingCustomerId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useSuspendCustomer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...customerMutations.suspend,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(result.message ?? "Customer account suspended")
    },
    onError: () => {
      toast.error("Failed to suspend customer account")
    },
  })

  return {
    suspendCustomer: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
    pendingCustomerId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...customerMutations.deactivate,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      toast.success(result.message ?? "Customer account deactivated")
    },
    onError: () => {
      toast.error("Failed to deactivate customer account")
    },
  })

  return {
    deactivateCustomer: (id: string) => mutation.mutateAsync(id),
    isPending: mutation.isPending,
    pendingCustomerId: mutation.isPending
      ? String(mutation.variables ?? "")
      : null,
  }
}

export function useIncreaseCnplEligibility(customerId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...customerMutations.increaseCnplEligibility,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(customerId),
      })
      toast.success(result.message ?? "CNPL eligibility limit increased")
    },
    onError: () => {
      toast.error("Failed to increase CNPL eligibility limit")
    },
  })

  return {
    increaseCnplEligibility: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
