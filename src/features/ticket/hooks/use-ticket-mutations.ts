"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ticketMutations } from "../api/mutations"
import { ticketKeys } from "../api/keys"
import { toast } from "@/lib/toast"

export function useCreateTicket() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.create,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Ticket created successfully")
    },
    onError: () => {
      toast.error("Failed to create ticket. Please try again.")
    },
  })

  return {
    createTicket: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.updateStatus,
    onSuccess: (result, { ticketId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(ticketKeys.detail(ticketId), result.data)
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Ticket status updated")
    },
    onError: () => {
      toast.error("Failed to update ticket status. Please try again.")
    },
  })

  return {
    updateStatus: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}

export function useAssignTicketResolver() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.assignResolver,
    onSuccess: (result, { ticketId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(ticketKeys.detail(ticketId), result.data)
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Resolver assigned successfully")
    },
    onError: () => {
      toast.error("Failed to assign resolver. Please try again.")
    },
  })

  return {
    assignResolver: mutation.mutateAsync,
    isPending: mutation.isPending,
  }
}
