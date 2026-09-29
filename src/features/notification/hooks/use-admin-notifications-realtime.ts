"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { getEcho } from "@/lib/echo"

import { notificationKeys } from "../api/keys"
import {
  ADMIN_NOTIFICATIONS_CHANNEL,
  ADMIN_NOTIFICATION_CREATED_EVENT,
} from "../constants"
import { playNotificationSound } from "../utils/play-notification-sound"

export function useAdminNotificationsRealtime(enabled = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return
    }

    const echo = getEcho()
    if (!echo) {
      return
    }

    const channel = echo.private(ADMIN_NOTIFICATIONS_CHANNEL)

    const handleCreated = () => {
      playNotificationSound()
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    }

    channel.listen(ADMIN_NOTIFICATION_CREATED_EVENT, handleCreated)

    return () => {
      channel.stopListening(ADMIN_NOTIFICATION_CREATED_EVENT)
      echo.leave(ADMIN_NOTIFICATIONS_CHANNEL)
    }
  }, [enabled, queryClient])
}
