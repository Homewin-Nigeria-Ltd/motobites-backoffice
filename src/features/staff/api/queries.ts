import { queryOptions } from "@tanstack/react-query"

import { api } from "@/lib/api/client"
import type {
  ApiStaffListResponse,
  ApiStaffRolesResponse,
  StaffListParams,
  StaffListResponse,
  StaffRoleOption,
} from "../types"
import { mapApiStaffMemberToStaffMember } from "../utils/staff-member"
import { staffEndpoints } from "./endpoints"
import { staffKeys } from "./keys"

async function fetchStaffList(params: StaffListParams): Promise<StaffListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    per_page: params.per_page ?? 8,
  }

  if (params.search?.trim()) {
    query.search = params.search.trim()
  }

  const response = await api.get<ApiStaffListResponse>(staffEndpoints.list, query)

  return {
    items: response.data.map(mapApiStaffMemberToStaffMember),
    meta: response.meta,
  }
}

async function fetchStaffRoles(): Promise<StaffRoleOption[]> {
  const response = await api.get<ApiStaffRolesResponse>(staffEndpoints.roles)
  return response.data
}

export const staffQueries = {
  list: (params: StaffListParams) =>
    queryOptions({
      queryKey: staffKeys.list(params),
      queryFn: () => fetchStaffList(params),
      placeholderData: (previous) => previous,
    }),

  roles: () =>
    queryOptions({
      queryKey: staffKeys.roles(),
      queryFn: fetchStaffRoles,
      staleTime: 5 * 60 * 1000,
    }),
}
