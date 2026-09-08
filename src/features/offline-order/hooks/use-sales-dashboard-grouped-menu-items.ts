"use client"

import { useMemo } from "react"

import type {
  ApiSalesDashboardKitchen,
  ApiSalesDashboardMenuItem,
  OfflineOrderSort,
} from "../types"
import { filterSalesDashboardMenuItems } from "../utils/filter-menu-items"
import { sortSalesDashboardMenuItems } from "../utils/sort-menu-items"

export type OfflineOrderMenuGroup = {
  kitchen: ApiSalesDashboardKitchen
  items: ApiSalesDashboardMenuItem[]
}

type UseSalesDashboardGroupedMenuItemsParams = {
  kitchens: ApiSalesDashboardKitchen[]
  search?: string
  sort: OfflineOrderSort
  includeEmptyGroups?: boolean
}

export function useSalesDashboardGroupedMenuItems({
  kitchens,
  search,
  sort,
  includeEmptyGroups = false,
}: UseSalesDashboardGroupedMenuItemsParams) {
  const groups = useMemo(() => {
    const nextGroups = kitchens.map((kitchen) => {
      const items = sortSalesDashboardMenuItems(
        filterSalesDashboardMenuItems(kitchen.menu_items ?? [], search),
        sort,
      )

      return {
        kitchen,
        items,
      }
    })

    if (includeEmptyGroups) {
      return nextGroups
    }

    return nextGroups.filter((group) => group.items.length > 0)
  }, [kitchens, search, sort, includeEmptyGroups])

  const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0)

  return {
    groups,
    totalItems,
    isPending: false,
    isError: false,
    error: undefined,
  }
}
