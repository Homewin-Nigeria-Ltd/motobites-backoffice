"use client"

import { useQuery } from "@tanstack/react-query"

import { restaurantQueries } from "../queries/restaurant.queries"

export function useRestaurant(restaurantId: string) {
  return useQuery(restaurantQueries.detail(restaurantId))
}
