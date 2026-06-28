export const ticketStatuses = [
  "open",
  "closed",
  "overdue",
  "resolved",
  "unresolved",
  "new",
] as const

export type TicketStatus = (typeof ticketStatuses)[number]

export const ticketTypes = [
  "complaint",
  "request",
  "enquiry",
  "suggestion",
] as const

export type TicketType = (typeof ticketTypes)[number]

export const ticketPeriods = ["monthly", "weekly", "daily"] as const

export type TicketPeriod = (typeof ticketPeriods)[number]

export const ticketAdminStatusOptions = ["open", "closed"] as const

export type TicketAdminStatus = (typeof ticketAdminStatusOptions)[number]

export type TicketSummaryKpi = {
  key: string
  label: string
  value: number
  changePercent: number
  trend: "up" | "down"
  variant?: "default" | "danger"
}

export type TicketResolutionRate = {
  withinTat: number
  exceededTat: number
  total: number
}

export type TicketIssueCategory = {
  key: string
  label: string
  count: number
}

export type TicketIssueCategoryOption = {
  key: string
  label: string
}

export type TicketVolumeByStatus = {
  status: string
  label: string
  count: number
}

export type TicketAlert = {
  ticketId: string
  ticketNumber: string
  urgencyText: string
  description: string
}

export type SupportTicket = {
  id: string
  ticketNumber: string
  createdAt: string
  type: TicketType
  typeLabel: string
  issueCategory: string
  issueCategoryLabel: string
  createdBy: string
  status: TicketStatus
  statusLabel: string
  resolverId: number | null
  resolverName: string | null
  resolverRole: string | null
  tat: string
  tatUrgent?: boolean
  description: string
}

export type TicketDashboardData = {
  alert: TicketAlert | null
  summaryKpis: TicketSummaryKpi[]
  resolutionRate: TicketResolutionRate
  ticketsByIssue: TicketIssueCategory[]
  ticketsRaised: TicketVolumeByStatus[]
  recentTickets: SupportTicket[]
  issueCategories: TicketIssueCategoryOption[]
}

export type CreateTicketInput = {
  type: TicketType
  issueCategory: string
  description: string
  resolverId?: number
  orderId?: string
}

export type ApiCreateTicketBody = {
  type: TicketType
  issue_category: string
  description: string
  resolver_id: number
  order_id?: string
}

export type TicketDashboardParams = {
  period?: TicketPeriod
}

export type TicketListParams = {
  page: number
  per_page?: number
}

export type TicketListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type TicketListResponse = {
  items: SupportTicket[]
  meta: TicketListMeta
}

export type ApiTicketUser = {
  id: number
  name: string
}

export type ApiTicketResolver = {
  id: number
  name: string
  label: string
} | null

export type ApiTicketTat = {
  days: number
  hours: number
  minutes: number
  formatted: string
  is_exceeded: boolean
}

export type ApiTicket = {
  id: string
  ticket_number: string
  type: string
  status: string
  issue_category: string
  description: string
  created_by: ApiTicketUser
  resolver: ApiTicketResolver
  tat: ApiTicketTat
  created_at: string
  created_at_iso: string
}

export type ApiTicketSummaryItem = {
  key: string
  label: string
  value: number
  change_percent: number
  trend: "up" | "down"
}

export type ApiUrgentAlert = {
  ticket_id?: string
  id?: string
  ticket_number: string
  urgency_text?: string
  description?: string
  message?: string
}

export type ApiTicketOverviewData = {
  urgent_alert: ApiUrgentAlert | null
  summary: ApiTicketSummaryItem[]
  resolution_rate: {
    total: number
    within_tat: number
    exceeded_tat: number
  }
  by_issue: Array<{
    key: string
    label: string
    count: number
  }>
  by_status: Array<{
    status: string
    label: string
    count: number
  }>
  recent: ApiTicket[]
  issue_categories: Array<{
    key: string
    label: string
  }>
}

export type ApiTicketOverviewResponse = {
  success: boolean
  data: ApiTicketOverviewData
}

export type ApiTicketListResponse = {
  success: boolean
  data: ApiTicket[]
  meta: TicketListMeta
}

export type ApiTicketDetailResponse = {
  success: boolean
  data: ApiTicket
}

export type UpdateTicketStatusInput = {
  ticketId: string
  status: TicketAdminStatus
}

export type AssignTicketResolverInput = {
  ticketId: string
  resolverId: number
}

export type TicketActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }
