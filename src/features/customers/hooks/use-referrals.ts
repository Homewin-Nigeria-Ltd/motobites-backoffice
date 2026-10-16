"use client"

import { useQuery } from "@tanstack/react-query"

import { customerQueries } from "../api/queries"
import type { ReferralListParams } from "../types"

export function useReferrals(
  params: ReferralListParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    ...customerQueries.referrals(params),
    enabled: options?.enabled ?? true,
  })
}
