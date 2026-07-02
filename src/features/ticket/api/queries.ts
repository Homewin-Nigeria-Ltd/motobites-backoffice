import type {
  ApiTicketByIssueResponse,
  ApiTicketByStatusResponse,
  ApiTicketDetailResponse,
  ApiTicketListResponse,
  ApiTicketResolutionRateResponse,
  ApiTicketSummaryResponse,
  ApiTicketUrgentAlertResponse,
  SupportTicket,
  TicketAlert,
  TicketIssueCategory,
  TicketListParams,
  TicketListResponse,
  TicketOverviewParams,
  TicketResolutionRate,
  TicketSummaryKpi,
  TicketVolumeByStatus,
} from "../types"
import {
  mapApiByIssueItem,
  mapApiByStatusItem,
  mapApiSummaryItem,
  mapApiTicketToSupportTicket,
  mapApiUrgentAlert,
  mapResolutionRate,
} from "../utils/ticket"
import { ticketEndpoints } from "./endpoints"
import { ticketKeys } from "./keys"
import { api } from "@/lib/api/client"
import { queryOptions } from "@tanstack/react-query"

function periodQuery(params: TicketOverviewParams) {
  return params.period ? { period: params.period } : undefined
}

async function fetchTicketSummary(): Promise<TicketSummaryKpi[]> {
  const response = await api.get<ApiTicketSummaryResponse>(
    ticketEndpoints.overviewSummary
  )

  return response.data.map(mapApiSummaryItem)
}

async function fetchTicketResolutionRate(
  params: TicketOverviewParams = {}
): Promise<TicketResolutionRate> {
  const response = await api.get<ApiTicketResolutionRateResponse>(
    ticketEndpoints.overviewResolutionRate,
    periodQuery(params)
  )

  return mapResolutionRate(response.data)
}

async function fetchTicketByIssue(
  params: TicketOverviewParams = {}
): Promise<TicketIssueCategory[]> {
  const response = await api.get<ApiTicketByIssueResponse>(
    ticketEndpoints.overviewByIssue,
    periodQuery(params)
  )

  return response.data.map(mapApiByIssueItem)
}

async function fetchTicketByStatus(
  params: TicketOverviewParams = {}
): Promise<TicketVolumeByStatus[]> {
  const response = await api.get<ApiTicketByStatusResponse>(
    ticketEndpoints.overviewByStatus,
    periodQuery(params)
  )

  return response.data.map(mapApiByStatusItem)
}

async function fetchTicketUrgentAlert(): Promise<TicketAlert | null> {
  const response = await api.get<ApiTicketUrgentAlertResponse>(
    ticketEndpoints.overviewUrgentAlert
  )

  return response.data ? mapApiUrgentAlert(response.data) : null
}

async function fetchTicketList(
  params: TicketListParams
): Promise<TicketListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 8,
  }

  const response = await api.get<ApiTicketListResponse>(
    ticketEndpoints.tickets,
    query
  )

  return {
    items: response.data.map(mapApiTicketToSupportTicket),
    meta: response.meta,
  }
}

async function fetchTicketDetail(id: string): Promise<SupportTicket> {
  const response = await api.get<ApiTicketDetailResponse>(
    ticketEndpoints.ticket(id)
  )

  return mapApiTicketToSupportTicket(response.data)
}

export const ticketQueries = {
  overviewSummary: () =>
    queryOptions({
      queryKey: ticketKeys.overviewSummary(),
      queryFn: () => fetchTicketSummary(),
      staleTime: 60 * 1000,
    }),

  overviewResolutionRate: (params: TicketOverviewParams = {}) =>
    queryOptions({
      queryKey: ticketKeys.overviewResolutionRate(params),
      queryFn: () => fetchTicketResolutionRate(params),
      staleTime: 60 * 1000,
    }),

  overviewByIssue: (params: TicketOverviewParams = {}) =>
    queryOptions({
      queryKey: ticketKeys.overviewByIssue(params),
      queryFn: () => fetchTicketByIssue(params),
      staleTime: 60 * 1000,
    }),

  overviewByStatus: (params: TicketOverviewParams = {}) =>
    queryOptions({
      queryKey: ticketKeys.overviewByStatus(params),
      queryFn: () => fetchTicketByStatus(params),
      staleTime: 60 * 1000,
    }),

  overviewUrgentAlert: () =>
    queryOptions({
      queryKey: ticketKeys.overviewUrgentAlert(),
      queryFn: () => fetchTicketUrgentAlert(),
      staleTime: 60 * 1000,
    }),

  list: (params: TicketListParams) =>
    queryOptions({
      queryKey: ticketKeys.list(params),
      queryFn: () => fetchTicketList(params),
      placeholderData: (previous) => previous,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ticketKeys.detail(id),
      queryFn: () => fetchTicketDetail(id),
    }),
}
