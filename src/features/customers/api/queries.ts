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

  const response = await api.get<ApiCustomerListResponse>(
    customerEndpoints.list,
    query
  )

  return {
    items: response.data.map(mapApiCustomerToCustomer),
    meta: response.meta,
  }
}

async function fetchCustomerOverview(): Promise<CustomerSummaryResponse> {
  const response = await api.get<ApiCustomerOverviewResponse>(
    customerEndpoints.overview
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
      placeholderData: (previous) => previous,
    }),

  overview: () =>
    queryOptions({
      queryKey: customerKeys.overview(),
      queryFn: fetchCustomerOverview,
      staleTime: 5 * 60 * 1000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: customerKeys.detail(id),
      queryFn: () => fetchCustomerDetail(id),
      enabled: Boolean(id.trim()),
    }),
}
