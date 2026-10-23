"use client"

import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import { customerEndpoints } from "@/features/customers/api/endpoints"
import type { ApiCustomer, ApiCustomerListResponse } from "@/features/customers/types"

import type { BroadcastCustomerOption } from "../types"

function resolveUserId(customer: ApiCustomer) {
  const raw = customer.user_id ?? customer.id
  const userId = typeof raw === "number" ? raw : Number(raw)

  return Number.isFinite(userId) ? userId : null
}

async function fetchBroadcastCustomers(search: string) {
  const query: Record<string, string | number> = {
    tab: "all",
    page: 1,
    per_page: 20,
  }

  if (search.trim()) {
    query.search = search.trim()
  }

  const response = await api.get<ApiCustomerListResponse>(
    customerEndpoints.list,
    query
  )

  return response.data.flatMap((customer) => {
    const userId = resolveUserId(customer)

    if (userId == null) {
      return []
    }

    return [
      {
        userId,
        name: customer.name || customer.full_name || customer.email || "Customer",
        email: customer.email ?? "",
      } satisfies BroadcastCustomerOption,
    ]
  })
}

export function useBroadcastCustomers(search: string, enabled: boolean) {
  return useQuery({
    queryKey: ["broadcast", "customers", search],
    queryFn: () => fetchBroadcastCustomers(search),
    enabled,
  })
}
