import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiCustomerListResponse,
  ApiCustomerOverviewResponse,
  ApiCustomerResponse,
  CustomerDetail,
  CustomerListParams,
  CustomerListResponse,
  CustomerSummaryResponse,
} from "../types"
import {
  mapApiCustomerToCustomer,
  mapApiOverviewToSummaryStats,
} from "../utils/customer"
import { mapApiCustomerDetailToCustomerDetail } from "../utils/customer-detail"
import { customerEndpoints } from "./endpoints"
import { customerKeys } from "./keys"

async function fetchCustomerList(
  params: CustomerListParams
): Promise<CustomerListResponse> {
  const query: Record<string, string | number> = {
    tab: params.tab ?? "all",
    page: params.page,
    per_page: params.per_page ?? 8,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  if (params.fulfillment_branch_id !== undefined && params.fulfillment_branch_id !== null) {
    query.fulfillment_branch_id = params.fulfillment_branch_id
  }

  const response = await api.get<ApiCustomerListResponse>(
    customerEndpoints.list,
    query
  )

  return {
    items: response.data.map(mapApiCustomerToCustomer),
    meta: response.meta,
  }
}

async function fetchCustomerOverview(branchId?: number | null): Promise<CustomerSummaryResponse> {
  const query: Record<string, string | number> = {}
  if (branchId !== undefined && branchId !== null) {
    query.fulfillment_branch_id = branchId
  }

  const response = await api.get<ApiCustomerOverviewResponse>(
    customerEndpoints.overview,
    query
  )

  return {
    stats: mapApiOverviewToSummaryStats(response.data),
  }
}

async function fetchCustomerDetail(id: string): Promise<CustomerDetail> {
  const response = await api.get<ApiCustomerResponse>(
    customerEndpoints.detail(id)
  )

  return mapApiCustomerDetailToCustomerDetail(response.data)
}

export const customerQueries = {
  list: (params: CustomerListParams) =>
    queryOptions({
      queryKey: customerKeys.list(params),
      queryFn: () => fetchCustomerList(params),
    }),

  overview: (branchId?: number | null) =>
    queryOptions({
      queryKey: customerKeys.overview(branchId),
      queryFn: () => fetchCustomerOverview(branchId),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: customerKeys.detail(id),
      queryFn: () => fetchCustomerDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
