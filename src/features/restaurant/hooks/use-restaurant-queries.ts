"use client"

import { useQuery } from "@tanstack/react-query"

import type {
  KitchenMenuItemsParams,
  MenuGroupedItemsParams,
} from "../api/queries"
import { restaurantQueries } from "../api/queries"

export function useRestaurants() {
  return useQuery(restaurantQueries.list())
}

export function useRestaurant(restaurantId: string) {
  return useQuery(restaurantQueries.detail(restaurantId))
}

export function useKitchenDetailForEdit(kitchenId: string | undefined) {
  return useQuery({
    ...restaurantQueries.detail(kitchenId ?? ""),
    enabled: Boolean(kitchenId),
    refetchOnMount: "always",
    staleTime: 0,
  })
}

export function useMenuHubs() {
  return useQuery(restaurantQueries.hubs())
}

export function useMenuGroupedItems(params: MenuGroupedItemsParams) {
  return useQuery(restaurantQueries.groupedMenuItems(params))
}

type UseKitchenMenuItemsParams = {
  kitchenId: string
  search?: string
  page?: number
  per_page?: number
  sort?: KitchenMenuItemsParams["sort"]
}

export function useKitchenMenuItems({
  kitchenId,
  search,
  page = 1,
  per_page = 20,
  sort = "latest",
}: UseKitchenMenuItemsParams) {
  const parsedKitchenId = Number(kitchenId)

  return useQuery({
    ...restaurantQueries.kitchenMenuItems({
      kitchen_id: parsedKitchenId,
      search: search?.trim() || undefined,
      page,
      per_page,
      sort,
    }),
    enabled: !Number.isNaN(parsedKitchenId) && parsedKitchenId > 0,
  })
}

export function useMenuItemDetail(
  itemId: string | undefined,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true

  return useQuery({
    ...restaurantQueries.menuItemDetail(itemId ?? ""),
    enabled: enabled && Boolean(itemId),
    refetchOnMount: "always",
    staleTime: 0,
  })
}

export function useFulfillmentBranches() {
  return useQuery(restaurantQueries.branches())
}

export function useKitchenTypes() {
  return useQuery({
    queryKey: ["restaurant", "kitchen-types"],
    queryFn: async () => {
      const res = await fetch("/api/proxy/admin/menu-management/kitchen-types")
      if (!res.ok) {
        return []
      }
      const json = await res.json()
      return (json.data ?? []) as Array<{ id: number; name: string; is_active: boolean }>
    },
    staleTime: 5 * 60 * 1000,
  })
}
