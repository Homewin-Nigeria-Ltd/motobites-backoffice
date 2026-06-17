import { api } from "@/lib/api/client"
import type {
  CreateRoleApiResponse,
  CreateRoleInput,
  DeleteRoleApiResponse,
  UpdateRoleApiResponse,
  UpdateRoleInput,
} from "../types"
import { rolePermissionsEndpoints } from "./endpoints"

export const rolePermissionsMutations = {
  createRole: {
    mutationFn: (input: CreateRoleInput) =>
      api.post<CreateRoleApiResponse, CreateRoleInput>(
        rolePermissionsEndpoints.roles,
        input
      ),
  },
  updateRole: {
    mutationFn: ({
      role,
      input,
    }: {
      role: string
      input: UpdateRoleInput
    }) =>
      api.patch<UpdateRoleApiResponse, UpdateRoleInput>(
        rolePermissionsEndpoints.roleDetail(role),
        input
      ),
  },
  deleteRole: {
    mutationFn: (role: string) =>
      api.delete<DeleteRoleApiResponse>(
        rolePermissionsEndpoints.roleDetail(role)
      ),
  },
} as const
