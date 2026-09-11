import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  InventoryListParams,
  InventoryListResponse,
  InventoryOverviewResponse,
} from "../types"
import { inventoryEndpoints } from "./endpoints"
import { inventoryKeys } from "./keys"

function fetchInventoryOverview(branchId?: number | null) {
  const query: Record<string, string | number> = {}
  if (branchId !== undefined && branchId !== null) {
    query.fulfillment_branch_id = branchId
  }
  return api.get<InventoryOverviewResponse>(inventoryEndpoints.overview, query)
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

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = params.fulfillment_branch_id
  }

  return api.get<InventoryListResponse>(inventoryEndpoints.items, query)
}

export const inventoryQueries = {
  overview: (branchId?: number | null) =>
    queryOptions({
      queryKey: inventoryKeys.overview(branchId),
      queryFn: () => fetchInventoryOverview(branchId),
    }),
  items: (params: InventoryListParams = {}) =>
    queryOptions({
      queryKey: inventoryKeys.items(params),
      queryFn: () => fetchInventoryItems(params),
    }),
}
