"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { orderMutations } from "../api/mutations"
import { orderKeys } from "../api/keys"
import type { OrderAssigneeType } from "../types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

const assignSuccessMessages: Record<OrderAssigneeType, string> = {
  chef: "Chef assigned successfully",
  rider: "MotoPilot assigned successfully",
  support: "Customer care representative assigned successfully",
}

const assignErrorMessages: Record<OrderAssigneeType, string> = {
  chef: "Failed to assign chef. Please try again.",
  rider: "Failed to assign MotoPilot. Please try again.",
  support: "Failed to assign customer care representative. Please try again.",
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...orderMutations.updateStatus,
    onSuccess: (data, { orderId }) => {
      queryClient.setQueryData(orderKeys.detail(orderId), data)
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast.success("Order status updated")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update order status. Please try again."
      toast.error(message)
    },
  })

  return {
    updateStatus: mutation.mutate,
    isPending: mutation.isPending,
  }
}

export function useAssignOrderAssignee() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...orderMutations.assignAssignee,
    onSuccess: (data, { orderId, type }) => {
      queryClient.setQueryData(orderKeys.detail(orderId), data)
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast.success(assignSuccessMessages[type])
    },
    onError: (error, { type }) => {
      const message =
        error instanceof ApiError ? error.message : assignErrorMessages[type]
      toast.error(message)
    },
  })

  return {
    assignAssignee: mutation.mutate,
    isPending: mutation.isPending,
  }
}

export function useExtendPrepTime() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...orderMutations.extendPrepTime,
    onSuccess: (data, { orderId }) => {
      queryClient.setQueryData(orderKeys.detail(orderId), data)
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      toast.success("Preparation time extended by 5 minutes")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to extend preparation time. Please try again."
      toast.error(message)
    },
  })

  return {
    extendPrepTime: mutation.mutate,
    isPending: mutation.isPending,
  }
}
