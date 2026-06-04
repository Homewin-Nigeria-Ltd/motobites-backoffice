import { api } from "@/lib/api/client"
import type { OrderAssigneeType, OrderDetailApiResponse } from "../types"
import { orderEndpoints } from "./endpoints"

export type UpdateOrderStatusInput = {
  orderId: string
  status: string
}

export type AssignOrderAssigneeInput = {
  orderId: string
  type: OrderAssigneeType
  userId: number
}

export type ExtendPrepTimeInput = {
  orderId: string
}

function getAssignEndpoint(orderId: string, type: OrderAssigneeType) {
  switch (type) {
    case "chef":
      return orderEndpoints.assignChef(orderId)
    case "rider":
      return orderEndpoints.assignRider(orderId)
    case "support":
      return orderEndpoints.assignSupport(orderId)
  }
}

export const orderMutations = {
  updateStatus: {
    mutationFn: ({ orderId, status }: UpdateOrderStatusInput) =>
      api
        .patch<OrderDetailApiResponse>(orderEndpoints.updateStatus(orderId), {
          status,
        })
        .then((response) => response.data),
  },

  assignAssignee: {
    mutationFn: ({ orderId, type, userId }: AssignOrderAssigneeInput) =>
      api
        .patch<OrderDetailApiResponse>(getAssignEndpoint(orderId, type), {
          user_id: userId,
        })
        .then((response) => response.data),
  },

  extendPrepTime: {
    mutationFn: ({ orderId }: ExtendPrepTimeInput) =>
      api
        .patch<OrderDetailApiResponse>(
          orderEndpoints.extendPrepTime(orderId),
          {}
        )
        .then((response) => response.data),
  },
} as const
