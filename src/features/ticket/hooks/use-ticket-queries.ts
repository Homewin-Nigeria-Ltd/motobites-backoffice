"use client"

import { useQuery } from "@tanstack/react-query"

import { staffQueries } from "@/features/staff/api/queries"
import { ticketQueries } from "../api/queries"
import type { TicketDashboardParams, TicketListParams } from "../types"

const STAFF_PAGE_SIZE = 100

export function useTicketDashboard(params: TicketDashboardParams = {}) {
  return useQuery(ticketQueries.overview(params))
}

export function useTicketList(params: TicketListParams) {
  return useQuery(ticketQueries.list(params))
}

export function useTicketDetail(ticketId: string | null, enabled = true) {
  return useQuery({
    ...ticketQueries.detail(ticketId ?? ""),
    enabled: enabled && Boolean(ticketId?.trim()),
  })
}

export function useTicketStaffResolvers(enabled = true) {
  return useQuery({
    ...staffQueries.list({ page: 1, per_page: STAFF_PAGE_SIZE }),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
