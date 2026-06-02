import { queryOptions } from "@tanstack/react-query"

import { orderHubsMock } from "../data/orders.mock"
import type { OrderHub } from "../types"
import { API_BASE_URL } from "@/constants/app"
import { api } from "@/lib/api/client"
import { orderKeys } from "./keys"

export const orderQueries = {
  hubs: () =>
    queryOptions({
      queryKey: orderKeys.hubs(),
      queryFn: () =>
        API_BASE_URL
          ? api.get<OrderHub[]>("/api/orders/hubs")
          : Promise.resolve(orderHubsMock),
    }),
}
