import { queryOptions } from "@tanstack/react-query"

import { getStaffListMock } from "../data/staff-members.mock"
import type { StaffListParams, StaffListResponse } from "../types"
import { API_BASE_URL } from "@/constants/app"
import { api } from "@/lib/api/client"
import { staffKeys } from "./keys"

export const staffQueries = {
  list: (params: StaffListParams) =>
    queryOptions({
      queryKey: staffKeys.list(params),
      queryFn: () =>
        API_BASE_URL
          ? api.get<StaffListResponse>("/api/staff", {
              page: params.page,
              per_page: params.per_page,
              search: params.search,
            })
          : Promise.resolve(getStaffListMock(params)),
      placeholderData: (previous) => previous,
    }),
}
