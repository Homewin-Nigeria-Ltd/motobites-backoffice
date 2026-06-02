"use client"

import { useQuery } from "@tanstack/react-query"

import { authQueries } from "../api/queries"

export function useSession() {
  return useQuery(authQueries.session())
}
