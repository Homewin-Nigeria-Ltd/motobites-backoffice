import { queryOptions } from "@tanstack/react-query"

import {
  defaultOpeningHours,
  restaurantsMock,
} from "../data/restaurants.mock"
import type { Hub, Restaurant } from "../types"
import { API_BASE_URL } from "@/constants/app"
import { api } from "@/lib/api/client"
import { hubs } from "./catalog.queries"
import { restaurantKeys } from "./keys"

export {
  HUB_TAB_ALL,
  hubTabs,
  hubs,
  restaurantOptions,
  defaultMenuTags,
  defaultMenuAvailability,
  complimentTags,
  improvementTags,
  menuDetailItems,
  getHubById,
  getHubNameById,
  getHubIdByName,
  getMenuById,
  getMenuNameById,
} from "./catalog.queries"

export { defaultOpeningHours }

export function getRestaurantById(restaurantId: string) {
  return restaurantsMock.find((restaurant) => restaurant.id === restaurantId)
}

export function buildRestaurantMenuHref(restaurantId: string) {
  return `/kitchen/${encodeURIComponent(restaurantId)}`
}

export function buildMenuItemHref(menuId: string, hubId?: string) {
  const path = `/menu/catalog/${encodeURIComponent(menuId)}`
  if (!hubId) return path
  return `${path}?hub=${encodeURIComponent(hubId)}`
}

export const restaurantQueries = {
  hubs: () =>
    queryOptions({
      queryKey: restaurantKeys.hubs(),
      queryFn: () =>
        API_BASE_URL
          ? api.get<Hub[]>("/api/menu/hubs")
          : Promise.resolve(hubs),
    }),

  list: () =>
    queryOptions({
      queryKey: restaurantKeys.lists(),
      queryFn: () =>
        API_BASE_URL
          ? api.get<Restaurant[]>("/api/restaurants")
          : Promise.resolve(restaurantsMock),
    }),

  detail: (restaurantId: string) =>
    queryOptions({
      queryKey: restaurantKeys.detail(restaurantId),
      queryFn: () => {
        if (API_BASE_URL) {
          return api.get<Restaurant>(
            `/api/restaurants/${encodeURIComponent(restaurantId)}`
          )
        }

        const restaurant = getRestaurantById(restaurantId)
        return restaurant
          ? Promise.resolve(restaurant)
          : Promise.reject(new Error("Restaurant not found"))
      },
      enabled: Boolean(restaurantId),
    }),
}
