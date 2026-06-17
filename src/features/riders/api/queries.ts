import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type { RidersListParams, RidersListResponse } from "../types"
import { ridersEndpoints } from "./endpoints"
import { ridersKeys } from "./keys"

function fetchRidersList(params: RidersListParams) {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 20,
    status: params.status ?? "all",
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  return api.get<RidersListResponse>(ridersEndpoints.list, query)
}

export const ridersQueries = {
  list: (params: RidersListParams) =>
    queryOptions({
      queryKey: ridersKeys.list(params),
      queryFn: () => fetchRidersList(params),
      placeholderData: (previous) => previous,
    }),
}
