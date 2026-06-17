"use client"

import Link from "next/link"

import type { ApiRole } from "../types"
import { RolePermissionBadge } from "./role-permission-badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type RoleCardProps = {
  role: ApiRole
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <Link href={`/settings/permissions/${role.slug}`} className="block h-full">
      <Card
        className={cn(
          "h-full min-w-0 gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-soft",
          "focus-visible:outline-none"
        )}
      >
        <div className="flex h-full min-w-0 flex-col px-5 py-5">
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-base font-semibold text-foreground">{role.name}</h3>
            <RolePermissionBadge
              label={role.permissions_grant_label}
              status={role.permissions_grant_status}
            />
          </div>
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {role.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
