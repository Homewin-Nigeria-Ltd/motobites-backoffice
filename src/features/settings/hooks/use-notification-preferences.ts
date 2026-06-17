"use client"

import { useQuery } from "@tanstack/react-query"

import { settingsQueries } from "../api/queries"

export function useNotificationPreferences() {
  return useQuery(settingsQueries.notifications())
}
