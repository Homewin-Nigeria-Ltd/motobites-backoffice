"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { RoleForm } from "../components/role-form"
import { useRoleDetail } from "../hooks/use-role-detail"
import { useUpdateRole } from "../hooks/use-role-mutations"
import {
  roleFormSchema,
  type RoleFormSchemaValues,
} from "../schemas/role-form.schema"
import type { PermissionCategory } from "../types"
import { buildCreateRoleInput } from "../utils/build-role-payload"
import { filterPermissionCatalog } from "../utils/filter-permissions"
import { AppLoader } from "@/components/ui/app-loader"

type EditRoleSectionProps = {
  roleId: string
}

export function EditRoleSection({ roleId }: EditRoleSectionProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const { data: roleDetail, isPending, isError } = useRoleDetail(roleId)
  const { updateRole, isPending: isUpdating } = useUpdateRole()

  const form = useForm<RoleFormSchemaValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: {},
    },
  })

  useEffect(() => {
    if (!roleDetail) return

    form.reset({
      name: roleDetail.role.name,
      description: roleDetail.role.description,
      permissions: roleDetail.permissions.reduce<Record<string, boolean>>(
        (accumulator, permission) => {
          accumulator[permission.key] = permission.has_access
          return accumulator
        },
        {}
      ),
    })
  }, [roleDetail, form])

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

  async function onSubmit(values: RoleFormSchemaValues) {
    await updateRole({
      role: roleId,
      input: buildCreateRoleInput(values),
    })
    router.push(`/settings/permissions/${roleId}`)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <RoleForm
          form={form}
          filteredCategories={filteredCategories}
          search={search}
          onSearchChange={setSearch}
          onSubmit={onSubmit}
          isSubmitting={isUpdating}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}
