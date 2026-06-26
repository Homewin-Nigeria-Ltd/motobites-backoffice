import type {
  ApiTicketDetailResponse,
  ApiTicketOverviewResponse,
  ApiTicketListResponse,
  SupportTicket,
  TicketDashboardData,
  TicketDashboardParams,
  TicketListParams,
  TicketListResponse,
} from "../types"
import {
  mapApiOverviewToDashboard,
  mapApiTicketToSupportTicket,
} from "../utils/ticket"
import { ticketEndpoints } from "./endpoints"
import { ticketKeys } from "./keys"
import { api } from "@/lib/api/client"
import { queryOptions } from "@tanstack/react-query"

async function fetchTicketOverview(
  params: TicketDashboardParams = {}
): Promise<TicketDashboardData> {
  const query: Record<string, string> = {}

  if (params.period) {
    query.period = params.period
  }

  const response = await api.get<ApiTicketOverviewResponse>(
    ticketEndpoints.overview,
    Object.keys(query).length > 0 ? query : undefined
  )

  return mapApiOverviewToDashboard(response.data)
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
  overview: (params: TicketDashboardParams = {}) =>
    queryOptions({
      queryKey: ticketKeys.overview(params),
      queryFn: () => fetchTicketOverview(params),
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
