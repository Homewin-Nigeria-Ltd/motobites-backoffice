"use client"

import type { Control } from "react-hook-form"
import { Controller } from "react-hook-form"

import type { PermissionCategory } from "../types"
import type { RoleFormSchemaValues } from "../schemas/role-form.schema"
import { Switch } from "@/components/ui/switch"

type RolePermissionsListProps = {
  categories: PermissionCategory[]
  control?: Control<RoleFormSchemaValues>
  permissions?: Record<string, boolean>
  onPermissionChange?: (permissionId: string, enabled: boolean) => void
  readOnly?: boolean
  showCategoryLabels?: boolean
}

export function RolePermissionsList({
  categories,
  control,
  permissions,
  onPermissionChange,
  readOnly = false,
  showCategoryLabels = true,
}: RolePermissionsListProps) {
  if (categories.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-muted-foreground">
        No permissions match your search.
      </p>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-4 bg-muted/60 px-5 py-3 text-sm font-medium text-muted-foreground">
        <span>Role</span>
        <span className="text-right">Access</span>
      </div>

      <div className="divide-y divide-border">
        {categories.map((category) => (
          <div key={category.id}>
            {showCategoryLabels ? (
              <div className="border-b border-border bg-background px-5 py-3">
                <p className="text-sm font-semibold text-foreground">
                  {category.label}:
                </p>
              </div>
            ) : null}

            {category.permissions.map((permission) => (
              <div
                key={permission.id}
                className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-start gap-4 px-5 py-5"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {permission.title}:
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    • {permission.description}
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  {control ? (
                    <Controller
                      name={`permissions.${permission.id}`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={field.onChange}
                          aria-label={`Toggle ${permission.title}`}
                        />
                      )}
                    />
                  ) : (
                    <Switch
                      checked={Boolean(permissions?.[permission.id])}
                      onCheckedChange={(checked) =>
                        onPermissionChange?.(permission.id, checked)
                      }
                      disabled={readOnly}
                      aria-label={`Toggle ${permission.title}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
