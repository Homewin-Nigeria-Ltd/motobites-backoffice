export type PermissionsGrantStatus = "all" | "few"

export type PermissionItem = {
  id: string
  title: string
  description: string
}

export type PermissionCategory = {
  id: string
  label: string
  permissions: PermissionItem[]
}

export type ApiRole = {
  id: number
  slug: string
  name: string
  description: string
  is_favorited: boolean
  is_system: boolean
  permissions_granted_count: number
  permissions_total_count: number
  permissions_grant_status: PermissionsGrantStatus
  permissions_grant_label: string
}

export type RolesApiResponse = {
  success: boolean
  data: ApiRole[]
  message?: string
}

export type ApiPermissionCatalogItem = {
  key: string
  name: string
  description: string
}

export type PermissionCatalogApiResponse = {
  success: boolean
  data: ApiPermissionCatalogItem[]
  message?: string
}

export type CreateRolePermissionInput = {
  key: string
  has_access: boolean
}

export type CreateRoleInput = {
  name: string
  description: string
  is_favorited: boolean
  permissions: CreateRolePermissionInput[]
}

export type CreateRoleApiResponse = {
  success: boolean
  data?: ApiRole
  message?: string
}

export type UpdateRoleInput = CreateRoleInput

export type UpdateRoleApiResponse = {
  success: boolean
  data?: ApiRole
  message?: string
}

export type DeleteRoleApiResponse = {
  success: boolean
  message?: string
}

export type ApiRoleDetailRole = {
  id: number
  slug: string
  name: string
  description: string
  is_favorited: boolean
  is_system: boolean
}

export type ApiRoleDetailPermission = {
  key: string
  name: string
  description: string
  has_access: boolean
}

export type RoleDetailApiResponse = {
  success: boolean
  data: {
    role: ApiRoleDetailRole
    permissions: ApiRoleDetailPermission[]
  }
  message?: string
}

export type RoleDetail = {
  id: string
  numericId: number
  name: string
  description: string
  isSystem: boolean
  categories: PermissionCategory[]
  permissionAccess: Record<string, boolean>
}

export type RoleFormValues = {
  name: string
  description: string
  permissions: Record<string, boolean>
}
