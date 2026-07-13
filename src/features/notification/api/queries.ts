import { queryOptions } from "@tanstack/react-query"

import type { NotificationsApiResponse, NotificationsListParams } from "../types"
import { api } from "@/lib/api/client"
import type { QueryParams } from "@/lib/api/client"
import { notificationKeys } from "./keys"
import { notificationEndpoints } from "./endpoints"

export const NOTIFICATIONS_PER_PAGE = 20

export function buildNotificationsListQueryParams(
  params: NotificationsListParams,
): QueryParams {
  const query: QueryParams = {
    filter: params.filter,
    per_page: params.per_page ?? NOTIFICATIONS_PER_PAGE,
  }

  if (params.page && params.page > 1) {
    query.page = params.page
  }

  return query
}

export const notificationQueries = {
  list: (params: NotificationsListParams) =>
    queryOptions({
      queryKey: notificationKeys.list(params),
      queryFn: () =>
        api.get<NotificationsApiResponse>(
          notificationEndpoints.list,
          buildNotificationsListQueryParams(params),
        ),
      placeholderData: (previousData, previousQuery) => {
        const previousParams = previousQuery?.queryKey[2] as
          | NotificationsListParams
          | undefined

        if (previousParams?.filter === params.filter) {
          return previousData
        }

        return undefined
      },
    }),
}
