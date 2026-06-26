import type {
  ApiTicket,
  ApiTicketOverviewData,
  ApiTicketResolver,
  ApiTicketSummaryItem,
  ApiUrgentAlert,
  SupportTicket,
  TicketAlert,
  TicketDashboardData,
  TicketIssueCategory,
  TicketResolutionRate,
  TicketStatus,
  TicketSummaryKpi,
  TicketType,
  TicketVolumeByStatus,
} from "../types"

const TICKET_TYPE_LABELS: Record<TicketType, string> = {
  complaint: "Complaint",
  request: "Request",
  enquiry: "Enquiry",
  suggestion: "Suggestion",
}

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  closed: "Closed",
  overdue: "Overdue",
  resolved: "Resolved",
  unresolved: "Unresolved",
  new: "New",
}

const ISSUE_CATEGORY_LABELS: Record<string, string> = {
  order: "Order Issues",
  payment: "Payment & Refunds",
  delivery: "Delivery",
  menu: "Menu & Items",
  rider: "Rider / MotoPilot",
  account: "Account",
}

export const DEFAULT_TICKET_ISSUE_CATEGORIES = Object.entries(
  ISSUE_CATEGORY_LABELS
).map(([key, label]) => ({ key, label }))

function getIssueCategoryLabel(key: string) {
  return ISSUE_CATEGORY_LABELS[key] ?? key.replace(/_/g, " ")
}

function isTicketStatus(value: string): value is TicketStatus {
  return [
    "open",
    "closed",
    "overdue",
    "resolved",
    "unresolved",
    "new",
  ].includes(value)
}

function isTicketType(value: string): value is TicketType {
  return ["complaint", "request", "enquiry", "suggestion"].includes(value)
}

function formatTatDisplay(tat: ApiTicket["tat"]) {
  const days = String(tat.days).padStart(2, "0")
  const hours = String(tat.hours).padStart(2, "0")
  const minutes = String(tat.minutes).padStart(2, "0")
  return `${days}:${hours}:${minutes}`
}

function parseResolver(resolver: ApiTicketResolver) {
  if (!resolver) {
    return { resolverName: null, resolverRole: null }
  }

  if (resolver.label.includes(" - ")) {
    const [name, ...roleParts] = resolver.label.split(" - ")
    return {
      resolverName: name.trim() || resolver.name,
      resolverRole: roleParts.join(" - ").trim() || null,
    }
  }

  return {
    resolverName: resolver.name,
    resolverRole: null,
  }
}

export function mapApiTicketToSupportTicket(ticket: ApiTicket): SupportTicket {
  const status = isTicketStatus(ticket.status) ? ticket.status : "open"
  const type = isTicketType(ticket.type) ? ticket.type : "complaint"
  const { resolverName, resolverRole } = parseResolver(ticket.resolver)

  return {
    id: ticket.id,
    ticketNumber: ticket.ticket_number,
    createdAt: ticket.created_at,
    type,
    typeLabel: TICKET_TYPE_LABELS[type],
    issueCategory: ticket.issue_category,
    issueCategoryLabel: getIssueCategoryLabel(ticket.issue_category),
    createdBy: ticket.created_by.name,
    status,
    statusLabel: TICKET_STATUS_LABELS[status],
    resolverId: ticket.resolver?.id ?? null,
    resolverName,
    resolverRole,
    tat: formatTatDisplay(ticket.tat),
    tatUrgent: ticket.tat.is_exceeded,
    description: ticket.description,
  }
}

function mapApiUrgentAlert(alert: ApiUrgentAlert): TicketAlert {
  const ticketId = alert.ticket_id ?? alert.id ?? ""
  const ticketNumber = alert.ticket_number.startsWith("Ticket ")
    ? alert.ticket_number
    : `Ticket ${alert.ticket_number}`

  return {
    ticketId,
    ticketNumber,
    urgencyText: alert.urgency_text ?? "requires urgent attention",
    description:
      alert.description ??
      alert.message ??
      `${ticketNumber} is approaching its deadline and requires urgent attention.`,
  }
}

function mapApiSummaryItem(item: ApiTicketSummaryItem): TicketSummaryKpi {
  return {
    key: item.key,
    label: item.label,
    value: item.value,
    changePercent: Math.abs(item.change_percent),
    trend: item.trend,
    variant: item.key === "overdue_ticket" ? "danger" : "default",
  }
}

function mapResolutionRate(
  rate: ApiTicketOverviewData["resolution_rate"]
): TicketResolutionRate {
  return {
    total: rate.total,
    withinTat: rate.within_tat,
    exceededTat: rate.exceeded_tat,
  }
}

export function mapApiOverviewToDashboard(
  data: ApiTicketOverviewData
): TicketDashboardData {
  return {
    alert: data.urgent_alert ? mapApiUrgentAlert(data.urgent_alert) : null,
    summaryKpis: data.summary.map(mapApiSummaryItem),
    resolutionRate: mapResolutionRate(data.resolution_rate),
    ticketsByIssue: data.by_issue.map(
      (item): TicketIssueCategory => ({
        key: item.key,
        label: item.label,
        count: item.count,
      })
    ),
    ticketsRaised: data.by_status.map(
      (item): TicketVolumeByStatus => ({
        status: item.status,
        label: item.label,
        count: item.count,
      })
    ),
    recentTickets: data.recent.map(mapApiTicketToSupportTicket),
    issueCategories:
      data.issue_categories.length > 0
        ? data.issue_categories
        : DEFAULT_TICKET_ISSUE_CATEGORIES,
  }
}
