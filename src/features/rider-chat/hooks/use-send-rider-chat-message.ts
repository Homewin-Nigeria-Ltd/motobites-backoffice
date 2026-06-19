"use client"

import { useMutation } from "@tanstack/react-query"

import { riderChatMutations } from "../api/mutations"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useSendRiderChatMessage() {
  const mutation = useMutation({
    ...riderChatMutations.sendMessage,
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to send message. Please try again."
      toast.error(message)
    },
  })

  return {
    sendMessage: mutation.mutate,
    isPending: mutation.isPending,
  }
}
