"use client"

import { useMemo } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useFulfillmentBranches } from "@/features/restaurant/hooks/use-restaurant-queries"
import type { FulfillmentBranch } from "@/features/restaurant/types"

type BranchComboboxProps = {
  id?: string
  value: string
  onChange: (branchId: string) => void
  className?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

export function BranchCombobox({
  id,
  value,
  onChange,
  className,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: BranchComboboxProps) {
  const { data: branches = [], isPending } = useFulfillmentBranches()

  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.isActive),
    [branches]
  )

  const selectedBranch = useMemo(
    () => activeBranches.find((branch) => branch.id === value) ?? null,
    [activeBranches, value]
  )

  return (
    <Combobox
      items={activeBranches}
      value={selectedBranch}
      onValueChange={(branch) => onChange(branch?.id ?? "")}
      itemToStringLabel={(branch) => branch.name}
      itemToStringValue={(branch) => branch.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled || isPending}
    >
      <ComboboxInput
        id={id}
        placeholder={isPending ? "Loading branches..." : "Select branch"}
        showClear={Boolean(value)}
        icon={{ name: "mapPin", position: "left" }}
        aria-invalid={ariaInvalid}
        disabled={disabled || isPending}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No branch found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(branch: FulfillmentBranch) => (
              <ComboboxItem key={branch.id} value={branch}>
                <div className="flex flex-col gap-0.5">
                  <span>{branch.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {branch.key}
                  </span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
