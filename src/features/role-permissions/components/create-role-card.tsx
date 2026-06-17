"use client"

import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function CreateRoleCard() {
  return (
    <Link href="/settings/permissions/new" className="block h-full">
      <Card
        className={cn(
          "h-full min-h-40 gap-0 border-dashed py-0 transition-shadow duration-200 hover:shadow-soft",
          "focus-visible:outline-none"
        )}
      >
        <div className="flex h-full flex-col items-center justify-center px-5 py-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <Icons.add size={28} className="text-primary" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-primary">
            Create a New Role
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Add a description</p>
        </div>
      </Card>
    </Link>
  )
}
