"use client"

import { useQuery } from "@tanstack/react-query"

import { restaurantQueries } from "../queries/restaurant.queries"

export function useMenuHubs() {
  return useQuery(restaurantQueries.hubs())
}
