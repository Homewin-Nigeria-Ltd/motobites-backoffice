import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type { DeliveryDashboardResponse } from "../types"
import { mapDeliveryDashboard } from "../utils/map-delivery-dashboard"
import { deliveryManagementEndpoints } from "./endpoints"
import { deliveryManagementKeys } from "./keys"

async function fetchDeliveryDashboard() {
  const response = await api.get<DeliveryDashboardResponse>(
    deliveryManagementEndpoints.dashboard
  )

  return mapDeliveryDashboard(response.data)
}

export const deliveryManagementQueries = {
  dashboard: () =>
    queryOptions({
      queryKey: deliveryManagementKeys.dashboard(),
      queryFn: fetchDeliveryDashboard,
      staleTime: 60_000,
    }),
}
