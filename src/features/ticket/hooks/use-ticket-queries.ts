"use client"

import { useQuery } from "@tanstack/react-query"

import { staffQueries } from "@/features/staff/api/queries"
import { ticketQueries } from "../api/queries"
import type { TicketListParams, TicketOverviewParams } from "../types"

const STAFF_PAGE_SIZE = 100

export function useTicketSummary(params: TicketOverviewParams = {}) {
  return useQuery(ticketQueries.overviewSummary(params))
}

export function useTicketResolutionRate(params: TicketOverviewParams = {}) {
  return useQuery(ticketQueries.overviewResolutionRate(params))
}

export function useTicketByIssue(params: TicketOverviewParams = {}) {
  return useQuery(ticketQueries.overviewByIssue(params))
}

export function useTicketByStatus(params: TicketOverviewParams = {}) {
  return useQuery(ticketQueries.overviewByStatus(params))
}

export function useTicketUrgentAlert(params: TicketOverviewParams = {}) {
  return useQuery(ticketQueries.overviewUrgentAlert(params))
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
