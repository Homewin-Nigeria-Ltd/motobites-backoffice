"use client"

import { useMutation } from "@tanstack/react-query"

import { toast } from "@/lib/toast"

import { broadcastMutations } from "../api/mutations"
import type { BroadcastNotificationInput } from "../types"

export function useBroadcastNotification() {
  const mutation = useMutation({
    ...broadcastMutations.send,
    onSuccess: () => {
      toast.success("Notification sent.")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send notification."
      )
    },
  })

  return {
    sendBroadcast: (input: BroadcastNotificationInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
