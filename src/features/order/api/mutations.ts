import { api, request } from "@/lib/api/client"
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

export type BroadcastRiderInput = {
  orderId: string
}

export type AcceptOrderInput = {
  orderId: string
}

export type RejectOrderInput = {
  orderId: string
  reason: string
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

  broadcastRider: {
    mutationFn: ({ orderId }: BroadcastRiderInput) =>
      api.post<OrderDetailApiResponse>(
        orderEndpoints.broadcastRider(orderId),
        {}
      ),
  },

  accept: {
    mutationFn: ({ orderId }: AcceptOrderInput) =>
      request<OrderDetailApiResponse>(orderEndpoints.accept(orderId), {
        method: "PATCH",
      }),
  },

  reject: {
    mutationFn: ({ orderId, reason }: RejectOrderInput) =>
      api.patch<OrderDetailApiResponse>(orderEndpoints.reject(orderId), {
        reason,
      }),
  },
} as const
