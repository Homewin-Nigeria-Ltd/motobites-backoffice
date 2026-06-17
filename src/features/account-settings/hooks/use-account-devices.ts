"use client"

import { useQuery } from "@tanstack/react-query"

import { accountSettingsQueries } from "../api/queries"

export function useAccountDevices() {
  return useQuery(accountSettingsQueries.devices())
}
