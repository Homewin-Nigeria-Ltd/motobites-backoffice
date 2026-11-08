import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"

import type {
  ApiSalesExecutive,
  ApiSalesExecutiveListResponse,
  SalesExecutiveAgentFilter,
  SalesExecutiveListParams,
  SalesExecutivePeriod,
  SalesExecutiveStatusCounts,
} from "../types"
import { mapApiSalesExecutive } from "../utils/map-sales-executive"
import { asRecord, num } from "../utils/read"
import {
  mapSalesExecutiveAgentDetail,
  mapSalesExecutiveAgents,
  mapSalesExecutiveOverview,
  mapSalesExecutiveTargets,
} from "../utils/map-performance"
import { salesExecutiveEndpoints } from "./endpoints"
import { salesExecutiveKeys } from "./keys"

async function fetchSalesExecutives(params: SalesExecutiveListParams) {
  const query: Record<string, string | number> = {
    page: params.page,
  }

  if (params.per_page) {
    query.per_page = params.per_page
  }

  if (params.status) {
    query.status = params.status
  }

  const response = await api.get<ApiSalesExecutiveListResponse>(
    salesExecutiveEndpoints.list,
    query
  )
  const counts = response.meta?.status_counts
  const statusCounts: SalesExecutiveStatusCounts = {
    all: num(counts?.all),
    personal_details: num(counts?.personal_details),
    verification_details: num(counts?.verification_details),
    under_review: num(counts?.under_review),
    approved: num(counts?.approved),
    rejected: num(counts?.rejected),
  }

  return {
    items: (response.data ?? []).map(mapApiSalesExecutive),
    meta: {
      current_page: response.current_page ?? params.page,
      last_page: response.last_page ?? 1,
      per_page: response.per_page ?? params.per_page ?? response.data?.length ?? 0,
      total: response.total ?? response.data?.length ?? 0,
      status_counts: statusCounts,
    },
  }
}

function isSalesExecutive(value: unknown): value is ApiSalesExecutive {
  const record = asRecord(value)
  return typeof record?.id === "number"
}

async function fetchSalesExecutive(id: number) {
  const application = await api.get<ApiSalesExecutive>(
    salesExecutiveEndpoints.application(id)
  )

  if (!isSalesExecutive(application)) {
    throw new Error("Application not found.")
  }

  return mapApiSalesExecutive(application)
}

function periodQuery(period: SalesExecutivePeriod, from?: string, to?: string) {
  const query: Record<string, string> = { period }

  if (period === "custom" && from && to) {
    query.from = from
    query.to = to
  }

  return query
}

export const salesExecutiveQueries = {
  list: (params: SalesExecutiveListParams) =>
    queryOptions({
      queryKey: salesExecutiveKeys.list(params),
      queryFn: () => fetchSalesExecutives(params),
    }),
  application: (id: number) =>
    queryOptions({
      queryKey: salesExecutiveKeys.application(id),
      queryFn: () => fetchSalesExecutive(id),
      enabled: id > 0,
    }),
  overview: (period: SalesExecutivePeriod, from?: string, to?: string) =>
    queryOptions({
      queryKey: [...salesExecutiveKeys.all, "overview", period, from, to],
      queryFn: async () =>
        mapSalesExecutiveOverview(
          await api.get(salesExecutiveEndpoints.overview, periodQuery(period, from, to))
        ),
      enabled: period !== "custom" || Boolean(from && to),
    }),
  agents: (
    period: SalesExecutivePeriod,
    filter: SalesExecutiveAgentFilter,
    search: string,
    from?: string,
    to?: string
  ) =>
    queryOptions({
      queryKey: [...salesExecutiveKeys.all, "agents", period, filter, search, from, to],
      queryFn: async () =>
        mapSalesExecutiveAgents(
          await api.get(salesExecutiveEndpoints.agents, {
            ...periodQuery(period, from, to),
            filter,
            ...(search.trim() ? { search: search.trim() } : {}),
          })
        ),
      enabled: period !== "custom" || Boolean(from && to),
    }),
  targets: (month: string, search: string) =>
    queryOptions({
      queryKey: [...salesExecutiveKeys.all, "targets", month, search],
      queryFn: async () =>
        mapSalesExecutiveTargets(
          await api.get(salesExecutiveEndpoints.targets, {
            month,
            ...(search.trim() ? { search: search.trim() } : {}),
          })
        ),
    }),
  agent: (id: string, month: string, page = 1) =>
    queryOptions({
      queryKey: [...salesExecutiveKeys.all, "agent", id, month, page],
      queryFn: async () =>
        mapSalesExecutiveAgentDetail(
          await api.get(salesExecutiveEndpoints.agent(id), {
            month,
            page,
            per_page: 20,
          })
        ),
      enabled: Boolean(id),
    }),
}
