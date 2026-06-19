"use client"

import { useQuery } from "@tanstack/react-query"

import { deliveryManagementQueries } from "../api/queries"

export function useDeliveryDashboard() {
  return useQuery(deliveryManagementQueries.dashboard())
}
