"use client"

import { useBranchFilter } from "@/context/branch-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export function BranchSelector({ className }: { className?: string }) {
  const { branchId, selectedBranch, activeBranches, setBranchId, isPending } =
    useBranchFilter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className={cn(
            "h-9 gap-2 rounded-full border-border/80 bg-background/80 px-3 text-xs font-medium backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground sm:text-sm",
            branchId !== null && "border-primary/40 bg-primary/5 text-primary font-semibold",
            className
          )}
        >
          <Icons.mapPin className={cn("size-3.5 sm:size-4 shrink-0", branchId ? "text-primary" : "text-muted-foreground")} />
          <span className="max-w-[120px] truncate sm:max-w-[180px]">
            {selectedBranch ? selectedBranch.name : "All Branches"}
          </span>
          <Icons.chevronDown className="size-3.5 opacity-60 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-xl">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Fulfillment Branch</span>
          {branchId !== null && (
            <button
              onClick={() => setBranchId(null)}
              className="text-[11px] font-normal text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setBranchId(null)}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm",
            branchId === null && "bg-accent font-medium text-accent-foreground"
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icons.layers className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium leading-none">All Branches</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                Global overview
              </span>
            </div>
          </div>
          {branchId === null && <Icons.check className="size-4 text-primary" />}
        </DropdownMenuItem>

        {activeBranches.length > 0 && <DropdownMenuSeparator />}

        <div className="max-h-60 overflow-y-auto">
          {activeBranches.map((branch) => {
            const isSelected = String(branch.id) === String(branchId)
            return (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => setBranchId(branch.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm",
                  isSelected && "bg-primary/10 font-medium text-primary"
                )}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icons.mapPin className="size-4" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium leading-none">
                      {branch.name}
                    </span>
                    {branch.address && (
                      <span className="truncate text-[11px] text-muted-foreground mt-0.5">
                        {branch.address}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && <Icons.check className="size-4 shrink-0 text-primary ml-2" />}
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
