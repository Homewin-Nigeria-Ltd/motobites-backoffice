"use client"

import { useMemo, useState } from "react"

import { AddBranchSheet } from "@/features/restaurant/components/add-branch-sheet"
import { BranchCard } from "@/features/restaurant/components/branch-card"
import { EditBranchSheet } from "@/features/restaurant/components/edit-branch-sheet"
import { useFulfillmentBranches } from "@/features/restaurant/hooks/use-restaurant-queries"
import type { FulfillmentBranch } from "@/features/restaurant/types"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BranchesSection() {
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<FulfillmentBranch | null>(
    null,
  )
  const { data: branches = [], isPending, isError, error } =
    useFulfillmentBranches()

  const filteredBranches = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return branches

    return branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(query) ||
        branch.key.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query)
    )
  }, [branches, search])

  if (isError) {
    throw error
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted">
      <div className="border-b border-border/50 bg-background px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl flex-1">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search branches"
              className="h-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-10 px-4"
              icon={{ name: "add", position: "left" }}
              onClick={() => setAddOpen(true)}
            >
              Add Branch
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
          {isPending ? (
            <AppLoader />
          ) : filteredBranches.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">
                {search
                  ? `No branches found for "${search}".`
                  : "No branches found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBranches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onEdit={setEditingBranch}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddBranchSheet open={addOpen} onOpenChange={setAddOpen} />
      <EditBranchSheet
        branch={editingBranch}
        open={editingBranch !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBranch(null)
          }
        }}
      />
    </div>
  )
}
