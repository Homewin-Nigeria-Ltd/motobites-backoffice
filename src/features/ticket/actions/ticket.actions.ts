"use server"

import { ticketServerEndpoints } from "../api/endpoints"
import type {
  ApiCreateTicketBody,
  ApiTicket,
  AssignTicketResolverInput,
  CreateTicketInput,
  SupportTicket,
  TicketActionResult,
  UpdateTicketStatusInput,
} from "../types"
import { mapApiTicketToSupportTicket } from "../utils/ticket"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): TicketActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

function toCreateTicketBody(input: CreateTicketInput): ApiCreateTicketBody {
  const body: ApiCreateTicketBody = {
    type: input.type,
    issue_category: input.issueCategory,
    description: input.description,
    resolver_id: input.resolverId ?? 0,
  }

  if (input.orderId?.trim()) {
    body.order_id = input.orderId.trim()
  }

  return body
}

export async function createTicketAction(
  input: CreateTicketInput
): Promise<TicketActionResult<SupportTicket>> {
  try {
    const data = await apiServer.post<ApiTicket>(
      ticketServerEndpoints.tickets,
      toCreateTicketBody(input)
    )

    return { success: true, data: mapApiTicketToSupportTicket(data) }
  } catch (error) {
    return toActionError(error, "Failed to create ticket")
  }
}

export async function updateTicketStatusAction({
  ticketId,
  status,
}: UpdateTicketStatusInput): Promise<TicketActionResult<SupportTicket>> {
  try {
    const data = await apiServer.patch<ApiTicket>(
      ticketServerEndpoints.updateStatus(ticketId),
      { status }
    )

    return { success: true, data: mapApiTicketToSupportTicket(data) }
  } catch (error) {
    return toActionError(error, "Failed to update ticket status")
  }
}

export async function assignTicketResolverAction({
  ticketId,
  resolverId,
}: AssignTicketResolverInput): Promise<TicketActionResult<SupportTicket>> {
  try {
    const data = await apiServer.patch<ApiTicket>(
      ticketServerEndpoints.assignResolver(ticketId),
      { resolver_id: resolverId }
    )

    return { success: true, data: mapApiTicketToSupportTicket(data) }
  } catch (error) {
    return toActionError(error, "Failed to assign resolver")
  }
}
