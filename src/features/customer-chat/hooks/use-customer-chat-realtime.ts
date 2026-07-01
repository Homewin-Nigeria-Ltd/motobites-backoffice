"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getEcho } from "@/lib/echo"
import { customerChatKeys } from "../api/keys"
import {
  getCustomerSupportChannelName,
  isCustomerSupportMessageEvent,
} from "../constants"
import type { ApiCustomerChatMessage } from "../types"
import {
  appendMessageToCache,
  parseRealtimeMessage,
} from "../utils/message-cache"

export type CustomerSupportMessageEvent = {
  message?: ApiCustomerChatMessage | string
  data?: ApiCustomerChatMessage
} & Partial<ApiCustomerChatMessage>

type UseCustomerChatRealtimeOptions = {
  enabled?: boolean
  onMessage?: (event: CustomerSupportMessageEvent) => void
}

function handleSupportMessageEvent(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  event: CustomerSupportMessageEvent,
  onMessage?: (event: CustomerSupportMessageEvent) => void
) {
  onMessage?.(event)

  const message = parseRealtimeMessage(event)

  if (message) {
    appendMessageToCache(queryClient, conversationId, message)
    return
  }

  void queryClient.invalidateQueries({
    queryKey: customerChatKeys.detail(conversationId),
    refetchType: "active",
  })
  void queryClient.invalidateQueries({
    queryKey: [...customerChatKeys.all, "conversations"],
    refetchType: "active",
  })
}

export function useCustomerChatRealtime(
  conversationId: string | null,
  { enabled = true, onMessage }: UseCustomerChatRealtimeOptions = {}
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !conversationId || typeof window === "undefined") {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channelName = getCustomerSupportChannelName(conversationId)
    const channel = echo.private(channelName)

    const handleAllEvents = (
      eventName: string,
      event: CustomerSupportMessageEvent
    ) => {
      if (!isCustomerSupportMessageEvent(eventName)) {
        return
      }

      handleSupportMessageEvent(
        queryClient,
        conversationId,
        event,
        onMessage
      )
    }

    channel.listenToAll(handleAllEvents)

    return () => {
      channel.stopListeningToAll(handleAllEvents)
      echo.leave(channelName)
    }
  }, [enabled, onMessage, queryClient, conversationId])
}
