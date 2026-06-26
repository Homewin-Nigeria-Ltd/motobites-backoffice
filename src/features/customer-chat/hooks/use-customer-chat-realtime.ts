"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getEcho } from "@/lib/echo"
import { customerChatKeys } from "../api/keys"
import {
  CUSTOMER_SUPPORT_MESSAGE_EVENT,
  getCustomerSupportChannelName,
} from "../constants"
import type { ApiCustomerChatMessage } from "../types"
import {
  appendMessageToCache,
  parseRealtimeMessage,
} from "../utils/message-cache"

export type CustomerSupportMessageEvent = {
  message?: ApiCustomerChatMessage
} & Partial<ApiCustomerChatMessage>

type UseCustomerChatRealtimeOptions = {
  enabled?: boolean
  onMessage?: (event: CustomerSupportMessageEvent) => void
}

export function useCustomerChatRealtime(
  chatId: string | null,
  { enabled = true, onMessage }: UseCustomerChatRealtimeOptions = {}
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !chatId || typeof window === "undefined") {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channelName = getCustomerSupportChannelName(chatId)
    const channel = echo.private(channelName)

    channel.listen(
      CUSTOMER_SUPPORT_MESSAGE_EVENT,
      (event: CustomerSupportMessageEvent) => {
        onMessage?.(event)

        const message = parseRealtimeMessage(event)

        if (message) {
          appendMessageToCache(queryClient, chatId, message)
        } else {
          void queryClient.invalidateQueries({
            queryKey: customerChatKeys.detail(chatId),
          })
          void queryClient.invalidateQueries({
            queryKey: [...customerChatKeys.all, "conversations"],
          })
        }
      }
    )

    return () => {
      echo.leave(channelName)
    }
  }, [chatId, enabled, onMessage, queryClient])
}
