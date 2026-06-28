import type { SupportTicket } from "../types"

export function filterTickets(
  tickets: SupportTicket[],
  search: string
): SupportTicket[] {
  const query = search.trim().toLowerCase()
  if (!query) return tickets

  return tickets.filter((ticket) => {
    const haystack = [
      ticket.ticketNumber,
      ticket.typeLabel,
      ticket.createdBy,
      ticket.statusLabel,
      ticket.resolverName,
      ticket.resolverRole,
      ticket.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return haystack.includes(query)
  })
}
