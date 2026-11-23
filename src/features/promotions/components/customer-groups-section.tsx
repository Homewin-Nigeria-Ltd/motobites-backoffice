"use client"

import { useState } from "react"

import { CreateCustomerGroupCard } from "@/features/promotions/components/create-customer-group-card"
import { CustomerGroupCard } from "@/features/promotions/components/customer-group-card"
import { CustomerGroupFormDialog } from "@/features/promotions/components/customer-group-form-dialog"
import { useCustomerGroups } from "@/features/promotions/hooks/use-promotion-queries"
import type { CustomerGroup } from "@/features/promotions/types"
import { AppLoader } from "@/components/ui/app-loader"

export function CustomerGroupsSection() {
  const {
    data: groups = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useCustomerGroups()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null)

  const openCreate = () => {
    setEditingGroup(null)
    setDialogOpen(true)
  }

  const openEdit = (group: CustomerGroup) => {
    setEditingGroup(group)
    setDialogOpen(true)
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Customer groups
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create groups and assign customers, then target them from promo
          offers.
        </p>
      </div>

      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-busy={isFetching}
      >
        {isPending && groups.length === 0 ? (
          <AppLoader className="min-h-42 sm:col-span-2 xl:col-span-2" />
        ) : isError ? (
          <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive sm:col-span-2 xl:col-span-2">
            {error instanceof Error
              ? error.message
              : "Failed to load customer groups."}
          </div>
        ) : (
          groups.map((group) => (
            <CustomerGroupCard
              key={group.id}
              group={group}
              onEdit={openEdit}
            />
          ))
        )}
        <CreateCustomerGroupCard onClick={openCreate} />
      </div>

      <CustomerGroupFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingGroup(null)
        }}
        group={editingGroup}
      />
    </section>
  )
}
