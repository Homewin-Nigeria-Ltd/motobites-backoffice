"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  riderOverviewStatuses,
  type RiderOverviewStatus,
  type RiderStatusFilter,
} from "../types"

const STATUS_PARAM = "status"

function parseStatus(value: string | null): RiderStatusFilter {
  if (
    value &&
    (riderOverviewStatuses as readonly string[]).includes(value)
  ) {
    return value as RiderOverviewStatus
  }

  return "all"
}

export function useRidersStatusFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const status = parseStatus(searchParams.get(STATUS_PARAM))

  const setStatus = useCallback(
    (nextStatus: RiderStatusFilter) => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextStatus === "all") {
        params.delete(STATUS_PARAM)
      } else {
        params.set(STATUS_PARAM, nextStatus)
      }

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    },
    [pathname, router, searchParams]
  )

  return { status, setStatus }
}
