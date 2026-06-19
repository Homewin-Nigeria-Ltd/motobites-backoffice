"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getEcho } from "@/lib/echo"
import { riderChatKeys } from "../api/keys"
import {
  getRiderSupportChannelName,
  RIDER_SUPPORT_MESSAGE_EVENT,
} from "../constants"
import type { ApiSupportMessage } from "../types"
import {
  appendMessageToCache,
  parseRealtimeMessage,
} from "../utils/message-cache"

export type RiderSupportMessageEvent = {
  message?: ApiSupportMessage
} & Partial<ApiSupportMessage>

type UseRiderChatRealtimeOptions = {
  enabled?: boolean
  onMessage?: (event: RiderSupportMessageEvent) => void
}

export function useRiderChatRealtime(
  riderId: number | null,
  { enabled = true, onMessage }: UseRiderChatRealtimeOptions = {}
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || !riderId || typeof window === "undefined") {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channelName = getRiderSupportChannelName(riderId)
    const channel = echo.private(channelName)

    channel.listen(RIDER_SUPPORT_MESSAGE_EVENT, (event: RiderSupportMessageEvent) => {
      onMessage?.(event)

      const message = parseRealtimeMessage(event)

      if (message) {
        appendMessageToCache(queryClient, riderId, message)
      } else {
        void queryClient.invalidateQueries({
          queryKey: riderChatKeys.messages(riderId),
        })
        void queryClient.invalidateQueries({
          queryKey: [...riderChatKeys.all, "conversations"],
        })
      }
    })

    return () => {
      echo.leave(channelName)
    }
  }, [enabled, onMessage, queryClient, riderId])
}
