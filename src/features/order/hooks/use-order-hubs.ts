"use client"

import { useQuery } from "@tanstack/react-query"

import { orderQueries } from "../queries/order.queries"

export function useOrderHubs() {
  return useQuery(orderQueries.hubs())
}
