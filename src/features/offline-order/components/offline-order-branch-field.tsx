"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
import { useBranchFilter } from "@/context/branch-context"
import { cn } from "@/lib/utils"

type OfflineOrderBranchFieldProps = {
  selectedBranchId: number | null
  selectedBranchName?: string | null
  onSelectBranch: (branchId: number | null, branchName: string) => void
}

export function OfflineOrderBranchField({
  selectedBranchId,
  selectedBranchName,
  onSelectBranch,
}: OfflineOrderBranchFieldProps) {
  const { activeBranches, isPending } = useBranchFilter()

  const currentBranch = useMemo(() => {
    if (selectedBranchId == null) {
      return null
    }
    return activeBranches.find((b) => Number(b.id) === selectedBranchId) ?? null
  }, [activeBranches, selectedBranchId])

  const displayName = currentBranch?.name ?? selectedBranchName ?? "Select Branch"
  const displayAddress = currentBranch?.address ?? ""

  return (
    <Card className="gap-0 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icons.mapPin className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            {displayAddress ? (
              <p className="truncate text-xs text-muted-foreground">
                {displayAddress}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Originating fulfillment branch for kitchen preparation
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending || activeBranches.length === 0}
              className="h-9 shrink-0 gap-1.5 border-border/80 px-3 text-xs font-medium"
            >
              <span>{selectedBranchId ? "Change Branch" : "Select Branch"}</span>
              <Icons.chevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-xl">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fulfillment Branches
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeBranches.map((branch) => {
              const isSelected = selectedBranchId === Number(branch.id)

              return (
                <DropdownMenuItem
                  key={branch.id}
                  onClick={() => onSelectBranch(Number(branch.id), branch.name)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm",
                    isSelected && "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{branch.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {branch.address}
                    </span>
                  </div>
                  {isSelected ? (
                    <Icons.check className="size-4 shrink-0 text-primary" />
                  ) : null}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
