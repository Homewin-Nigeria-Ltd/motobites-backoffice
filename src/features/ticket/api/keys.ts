import type { TicketListParams, TicketOverviewParams } from "../types"

export const ticketKeys = {
  all: ["ticket"] as const,
  overviewSummary: (params?: TicketOverviewParams) =>
    [...ticketKeys.all, "overview", "summary", params ?? {}] as const,
  overviewResolutionRate: (params?: TicketOverviewParams) =>
    [...ticketKeys.all, "overview", "resolution-rate", params ?? {}] as const,
  overviewByIssue: (params?: TicketOverviewParams) =>
    [...ticketKeys.all, "overview", "by-issue", params ?? {}] as const,
  overviewByStatus: (params?: TicketOverviewParams) =>
    [...ticketKeys.all, "overview", "by-status", params ?? {}] as const,
  overviewUrgentAlert: (params?: TicketOverviewParams) =>
    [...ticketKeys.all, "overview", "urgent-alert", params ?? {}] as const,
  list: (params: TicketListParams) =>
    [...ticketKeys.all, "list", params] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
}
