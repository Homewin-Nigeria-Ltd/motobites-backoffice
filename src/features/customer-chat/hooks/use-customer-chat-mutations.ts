"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { customerChatMutations } from "../api/mutations"
import { customerChatKeys } from "../api/keys"
import { markChatClosedInCache } from "../utils/message-cache"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useSendCustomerChatMessage() {
  const mutation = useMutation({
    ...customerChatMutations.sendMessage,
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

export function useCloseCustomerChatConversation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...customerChatMutations.closeConversation,
    onSuccess: (_data, { chatId }) => {
      markChatClosedInCache(queryClient, chatId)
      void queryClient.invalidateQueries({
        queryKey: customerChatKeys.conversations(),
      })
      void queryClient.invalidateQueries({
        queryKey: customerChatKeys.detail(chatId),
      })
      toast.success("Conversation closed")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to close conversation. Please try again."
      toast.error(message)
    },
  })

  return {
    closeConversation: mutation.mutate,
    isPending: mutation.isPending,
  }
}
