"use client"

import { CreateRoleCard } from "../components/create-role-card"
import { RoleCard } from "../components/role-card"
import { useRoles } from "../hooks/use-roles"
import { AppLoader } from "@/components/ui/app-loader"

export function PermissionsListSection() {
  const { data: roles, isPending, isError } = useRoles()

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Could not load roles.
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {roles?.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
          <CreateRoleCard />
        </div>
      </div>
    </div>
  )
}
