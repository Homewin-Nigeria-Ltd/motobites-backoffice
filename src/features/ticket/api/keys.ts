import type { TicketDashboardParams, TicketListParams } from "../types"

export const ticketKeys = {
  all: ["ticket"] as const,
  overview: (params?: TicketDashboardParams) =>
    [...ticketKeys.all, "overview", params ?? {}] as const,
  list: (params: TicketListParams) =>
    [...ticketKeys.all, "list", params] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
}
