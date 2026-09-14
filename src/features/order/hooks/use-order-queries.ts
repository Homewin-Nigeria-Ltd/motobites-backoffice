"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useBranchFilter } from "@/context/branch-context"
import { orderQueries } from "../api/queries"
import type { OrderAssigneeType, OrderTab } from "../types"

const SEARCH_PARAM = "search"
const DEBOUNCE_MS = 300

const emptyTabCounts: Record<OrderTab, number> = {
  pending: 0,
  processing: 0,
  transit: 0,
  completed: 0,
  performance: 0,
}

type UseOrdersParams = {
  tab: OrderTab
  per_page?: number
  page?: number
  search?: string
  fulfillment_branch_id?: number | null
}

export function useOrders({
  tab,
  per_page = 20,
  page = 1,
  search,
  fulfillment_branch_id,
}: UseOrdersParams) {
  const { branchId: contextBranchId } = useBranchFilter()
  const activeBranchId =
    fulfillment_branch_id !== undefined ? fulfillment_branch_id : contextBranchId
  const queryTab = tab === "performance" ? "pending" : tab
  const trimmedSearch = search?.trim()

  return useQuery({
    ...orderQueries.grouped({
      tab: queryTab,
      per_page,
      page,
      search: trimmedSearch || undefined,
      fulfillment_branch_id: activeBranchId,
      branch_id: activeBranchId,
    }),
    enabled: tab !== "performance",
  })
}

export function useOrderDetail(orderId: string | null, enabled = true) {
  return useQuery({
    ...orderQueries.detail(orderId ?? ""),
    enabled: enabled && Boolean(orderId),
  })
}

export function useOrderTabCounts(fulfillment_branch_id?: number | null) {
  const { branchId: contextBranchId } = useBranchFilter()
  const activeBranchId =
    fulfillment_branch_id !== undefined ? fulfillment_branch_id : contextBranchId
  const query = useQuery(orderQueries.tabCounts(activeBranchId))

  const counts: Record<OrderTab, number> = query.data
    ? {
        pending: query.data.pending,
        processing: query.data.processing,
        transit: query.data.transit,
        completed: query.data.completed,
        performance: 0,
      }
    : emptyTabCounts

  return { ...query, counts }
}

export function useOrderSearchQuery() {
  const searchParams = useSearchParams()
  return searchParams.get(SEARCH_PARAM)?.trim() ?? ""
}

export function useOrderSearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const urlSearch = searchParams.get(SEARCH_PARAM) ?? ""
  const [value, setValue] = useState(urlSearch)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)

  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch)
    setValue(urlSearch)
  }

  useEffect(() => {
    const trimmed = value.trim()
    const current = searchParams.get(SEARCH_PARAM) ?? ""

    if (trimmed === current) {
      return
    }

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (trimmed) {
        params.set(SEARCH_PARAM, trimmed)
      } else {
        params.delete(SEARCH_PARAM)
      }

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value, pathname, router, searchParams])

  return { value, setValue }
}

export function useOrderAssignees(
  type: OrderAssigneeType,
  enabled = true,
  fulfillment_branch_id?: number | null
) {
  const { branchId: contextBranchId } = useBranchFilter()
  const activeBranchId =
    fulfillment_branch_id !== undefined ? fulfillment_branch_id : contextBranchId

  return useQuery({
    ...orderQueries.assignees(type, activeBranchId),
    enabled,
  })
}

export function useOrderReceipt(orderId: string | null, enabled = true) {
  return useQuery({
    ...orderQueries.receipt(orderId ?? ""),
    enabled: enabled && Boolean(orderId),
  })
}
