"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { PermissionsSearchInput } from "../components/permissions-search-input"
import { RoleDetailHeader } from "../components/role-detail-header"
import { RolePermissionsList } from "../components/role-permissions-list"
import { useRoleDetail } from "../hooks/use-role-detail"
import { useDeleteRole } from "../hooks/use-role-mutations"
import type { PermissionCategory } from "../types"
import { filterPermissionCatalog } from "../utils/filter-permissions"
import { BackLink } from "@/components/back-link"
import { BaseAlertDialog } from "@/components/ui/base-alert-dialog"
import { AppLoader } from "@/components/ui/app-loader"

type RoleDetailSectionProps = {
  roleId: string
}

export function RoleDetailSection({ roleId }: RoleDetailSectionProps) {
  const router = useRouter()
  const { data: roleDetail, isPending, isError } = useRoleDetail(roleId)
  const { deleteRole, isPending: isDeleting } = useDeleteRole()
  const [search, setSearch] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)

  const permissions = useMemo(() => {
    if (!roleDetail) return {}

    return roleDetail.permissions.reduce<Record<string, boolean>>(
      (accumulator, permission) => {
        accumulator[permission.key] = permission.has_access
        return accumulator
      },
      {}
    )
  }, [roleDetail])

  const filteredCategories = useMemo(
    () => {
      if (!roleDetail) return []

      const categories: PermissionCategory[] = [
        {
          id: "permissions",
          label: "Permissions",
          permissions: roleDetail.permissions.map((permission) => ({
            id: permission.key,
            title: permission.name,
            description: permission.description,
          })),
        },
      ]

      return filterPermissionCatalog(categories, search)
    },
    [roleDetail, search]
  )

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError || !roleDetail) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Role not found.
      </div>
    )
  }

  const role = roleDetail.role

  async function handleDelete() {
    await deleteRole(role.slug)
    setDeleteOpen(false)
    router.push("/settings/permissions")
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="mb-4">
          <BackLink href="/settings/permissions" label="permissions" />
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
          <div className="space-y-8">
            <PermissionsSearchInput value={search} onChange={setSearch} />

            <RoleDetailHeader
              name={role.name}
              description={role.description}
              onEdit={() =>
                router.push(`/settings/permissions/${role.slug}/edit`)
              }
              onDelete={() => setDeleteOpen(true)}
            />

            <RolePermissionsList
              categories={filteredCategories}
              permissions={permissions}
              readOnly
              showCategoryLabels={false}
            />
          </div>
        </div>
      </div>

      <BaseAlertDialog
        title="Delete role?"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        confirmVariant="destructive"
        isPending={isDeleting}
        onConfirm={() => {
          void handleDelete()
        }}
      >
        This will permanently delete &quot;{role.name}&quot;. This action
        cannot be undone.
      </BaseAlertDialog>
    </>
  )
}
