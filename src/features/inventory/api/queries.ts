import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  InventoryListParams,
  InventoryListResponse,
  InventoryOverviewResponse,
} from "../types"
import { inventoryEndpoints } from "./endpoints"
import { inventoryKeys } from "./keys"

function fetchInventoryOverview() {
  return api.get<InventoryOverviewResponse>(inventoryEndpoints.overview)
}

function fetchInventoryItems(params: InventoryListParams = {}) {
  const query: Record<string, string | number> = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 20,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.category?.trim()) {
    query.category = params.category.trim()
  }

  if (params.stock_level?.trim()) {
    query.stock_level = params.stock_level.trim()
  }

  return api.get<InventoryListResponse>(inventoryEndpoints.items, query)
}

export const inventoryQueries = {
  overview: () =>
    queryOptions({
      queryKey: inventoryKeys.overview(),
      queryFn: fetchInventoryOverview,
    }),
  items: (params: InventoryListParams = {}) =>
    queryOptions({
      queryKey: inventoryKeys.items(params),
      queryFn: () => fetchInventoryItems(params),
    }),
}
