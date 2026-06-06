import { queryOptions } from "@tanstack/react-query"

import type {
  ApiKitchen,
  ApiKitchenDetailResponse,
  ApiKitchensResponse,
  ApiMenuGroupedResponse,
  ApiMenuItemDetailResponse,
  ApiMenuItemsListResponse,
  Hub,
  Restaurant,
} from "../types"
import { mapKitchenDetailToRestaurant } from "../utils/kitchen-form"
import { api } from "@/lib/api/client"
import { restaurantEndpoints } from "./endpoints"
import { restaurantKeys } from "./keys"

function mapKitchenToRestaurant(kitchen: ApiKitchen): Restaurant {
  return {
    id: String(kitchen.id),
    name: kitchen.name,
    description: "",
    imageUrl: kitchen.image ?? "",
    tags: [],
    openingHours: [],
    hubId: String(kitchen.id),
    menus: [],
    isOpen: kitchen.is_open,
  }
}

async function fetchKitchens() {
  const response = await api.get<ApiKitchensResponse>(restaurantEndpoints.kitchens)
  return response.data.map(mapKitchenToRestaurant)
}

async function fetchKitchenDetail(kitchenId: string) {
  const response = await api.get<ApiKitchenDetailResponse>(
    restaurantEndpoints.kitchen(kitchenId)
  )
  return mapKitchenDetailToRestaurant(response.data)
}

export async function getRestaurantById(restaurantId: string) {
  return fetchKitchenDetail(restaurantId)
}

export function buildRestaurantMenuHref(kitchenId: string) {
  return `/kitchen/${encodeURIComponent(kitchenId)}/menu-items`
}

export function buildKitchenDetailHref(kitchenId: string) {
  return `/kitchen/${encodeURIComponent(kitchenId)}`
}

export function buildMenuItemHref(_menuId: string, kitchenId?: string) {
  if (kitchenId) {
    return buildKitchenDetailHref(kitchenId)
  }
  return "/kitchen"
}

export type MenuGroupedItemsParams = {
  sort?: "latest" | "oldest" | "price_asc" | "price_desc" | "name"
  search?: string
}

export type KitchenMenuItemsParams = {
  kitchen_id: number
  search?: string
  sort?: "latest" | "oldest" | "price_asc" | "price_desc" | "name"
  per_page?: number
  page?: number
}

export const restaurantQueries = {
  hubs: () =>
    queryOptions({
      queryKey: restaurantKeys.hubs(),
      queryFn: () => api.get<Hub[]>(restaurantEndpoints.hubs),
    }),

  list: () =>
    queryOptions({
      queryKey: restaurantKeys.lists(),
      queryFn: fetchKitchens,
      staleTime: 30_000,
    }),

  detail: (restaurantId: string) =>
    queryOptions({
      queryKey: restaurantKeys.detail(restaurantId),
      queryFn: () => fetchKitchenDetail(restaurantId),
      enabled: Boolean(restaurantId),
      staleTime: 30_000,
    }),

  groupedMenuItems: (params: MenuGroupedItemsParams) =>
    queryOptions({
      queryKey: restaurantKeys.groupedMenuItems(params),
      queryFn: () => {
        const query: Record<string, string> = {
          sort: params.sort ?? "latest",
        }

        if (params.search) {
          query.search = params.search
        }

        return api
          .get<ApiMenuGroupedResponse>(restaurantEndpoints.groupedMenuItems, query)
          .then((response) => response.data)
      },
      staleTime: 30_000,
    }),

  kitchenMenuItems: (params: KitchenMenuItemsParams) =>
    queryOptions({
      queryKey: restaurantKeys.kitchenMenuItems(params),
      queryFn: () => {
        const query: Record<string, string | number> = {
          kitchen_id: params.kitchen_id,
          sort: params.sort ?? "latest",
          per_page: params.per_page ?? 20,
          page: params.page ?? 1,
        }

        if (params.search) {
          query.search = params.search
        }

        return api.get<ApiMenuItemsListResponse>(
          restaurantEndpoints.menuItems,
          query
        )
      },
      placeholderData: (previous) => previous,
      staleTime: 30_000,
    }),

  menuItemDetail: (itemId: string) =>
    queryOptions({
      queryKey: restaurantKeys.menuItemDetail(itemId),
      queryFn: () =>
        api
          .get<ApiMenuItemDetailResponse>(restaurantEndpoints.menuItem(itemId))
          .then((response) => response.data.item),
      enabled: Boolean(itemId),
      staleTime: 30_000,
    }),
} as const
