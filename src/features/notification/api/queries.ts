import { queryOptions } from "@tanstack/react-query"

import type { NotificationsApiResponse, NotificationsListParams } from "../types"
import { api } from "@/lib/api/client"
import { notificationKeys } from "./keys"
import { notificationEndpoints } from "./endpoints"

export const notificationQueries = {
  list: (params: NotificationsListParams) =>
    queryOptions({
      queryKey: notificationKeys.list(params),
      queryFn: () =>
        api.get<NotificationsApiResponse>(notificationEndpoints.list, {
          filter: params.filter,
          per_page: params.per_page ?? 20,
          page: params.page ?? 1,
        }),
      placeholderData: (previous) => previous,
    }),
}
