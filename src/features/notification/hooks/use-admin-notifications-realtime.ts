"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getEcho } from "@/lib/echo"

import { notificationKeys } from "../api/keys"
import {
  ADMIN_NOTIFICATIONS_CHANNEL,
  ADMIN_NOTIFICATION_CREATED_EVENT,
} from "../constants"
import {
  getIncomingOrderAlert,
  type IncomingOrderAlert,
} from "../utils/incoming-order-alert"
import { playNotificationSound } from "../utils/play-notification-sound"

export function useAdminNotificationsRealtime(enabled = true) {
  const queryClient = useQueryClient()
  const [incoming, setIncoming] = useState<IncomingOrderAlert[]>([])

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channel = echo.private(ADMIN_NOTIFICATIONS_CHANNEL)

    const handleCreated = (event: unknown) => {
      playNotificationSound()
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all })

      const alert = getIncomingOrderAlert(event)
      if (!alert) {
        return
      }

      setIncoming((current) => {
        if (current.some((item) => item.id === alert.id || item.orderId === alert.orderId)) {
          return current
        }

        return [...current, alert]
      })
    }

    channel.listen(ADMIN_NOTIFICATION_CREATED_EVENT, handleCreated)

    return () => {
      channel.stopListening(ADMIN_NOTIFICATION_CREATED_EVENT)
      echo.leave(ADMIN_NOTIFICATIONS_CHANNEL)
    }
  }, [enabled, queryClient])

  return {
    incoming,
    dismissIncoming: (id: string) => {
      setIncoming((current) => current.filter((item) => item.id !== id))
    },
  }
}
