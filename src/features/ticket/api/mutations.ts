import {
  assignTicketResolverAction,
  createTicketAction,
  updateTicketStatusAction,
} from "../actions/ticket.actions"
import type {
  AssignTicketResolverInput,
  CreateTicketInput,
  UpdateTicketStatusInput,
} from "../types"

export type { AssignTicketResolverInput, UpdateTicketStatusInput }

export const ticketMutations = {
  create: {
    mutationFn: (input: CreateTicketInput) => createTicketAction(input),
  },

  updateStatus: {
    mutationFn: (input: UpdateTicketStatusInput) =>
      updateTicketStatusAction(input),
  },

  assignResolver: {
    mutationFn: (input: AssignTicketResolverInput) =>
      assignTicketResolverAction(input),
  },
} as const
