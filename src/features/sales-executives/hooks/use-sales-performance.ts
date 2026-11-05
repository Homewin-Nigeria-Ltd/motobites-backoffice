"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

import { salesExecutiveKeys } from "../api/keys"
import { salesExecutiveMutations } from "../api/mutations"
import { salesExecutiveQueries } from "../api/queries"
import type {
  SalesExecutiveAgentFilter,
  SalesExecutivePeriod,
  SetSalesExecutiveTargetsInput,
  UpdateSalesExecutiveStatusInput,
} from "../types"

export function useSalesExecutiveOverview(
  period: SalesExecutivePeriod,
  from?: string,
  to?: string
) {
  return useQuery(salesExecutiveQueries.overview(period, from, to))
}

export function useSalesExecutiveAgents(
  period: SalesExecutivePeriod,
  filter: SalesExecutiveAgentFilter,
  search: string,
  from?: string,
  to?: string
) {
  return useQuery(salesExecutiveQueries.agents(period, filter, search, from, to))
}

export function useSalesExecutiveTargets(month: string, search: string) {
  return useQuery(salesExecutiveQueries.targets(month, search))
}

export function useSalesExecutiveAgent(id: string, month: string, page = 1) {
  return useQuery(salesExecutiveQueries.agent(id, month, page))
}

export function useSetSalesExecutiveTargets() {
  const queryClient = useQueryClient()

  return useMutation({
    ...salesExecutiveMutations.setTargets,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: salesExecutiveKeys.all })
      toast.success("Target saved.")
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not save this target."
      )
    },
  })
}

export function useUpdateSalesExecutiveStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    ...salesExecutiveMutations.updateStatus,
    onSuccess: (_data, input: UpdateSalesExecutiveStatusInput) => {
      void queryClient.invalidateQueries({ queryKey: salesExecutiveKeys.all })
      toast.success(
        input.status === "suspended" ? "Agent suspended." : "Agent reinstated."
      )
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update this agent."
      )
    },
  })
}

export type { SetSalesExecutiveTargetsInput }
