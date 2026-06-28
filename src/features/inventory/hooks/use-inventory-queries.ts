"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryQueries } from "../api/queries"
import type { InventoryListParams } from "../types"

export function useInventoryOverview() {
  return useQuery(inventoryQueries.overview())
}

export function useInventoryItems(params: InventoryListParams) {
  return useQuery(inventoryQueries.items(params))
}
