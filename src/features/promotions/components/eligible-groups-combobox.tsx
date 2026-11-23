"use client"

import { useMemo } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { useCustomerGroups } from "@/features/promotions/hooks/use-promotion-queries"
import { cn } from "@/lib/utils"

export type EligibleGroupOption = {
  id: string
  label: string
}

type EligibleGroupsComboboxProps = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  invalid?: boolean
}

export function EligibleGroupsCombobox({
  value,
  onChange,
  disabled,
  invalid,
}: EligibleGroupsComboboxProps) {
  const anchor = useComboboxAnchor()
  const { data: groups = [], isPending } = useCustomerGroups()

  const options = useMemo<EligibleGroupOption[]>(
    () =>
      groups.map((group) => ({
        id: group.id,
        label: `${group.name} · ${group.membersCount} customer${
          group.membersCount === 1 ? "" : "s"
        }`,
      })),
    [groups]
  )

  const selected = useMemo(
    () =>
      value.map((id) => {
        const match = options.find((option) => option.id === id)
        return match ?? { id, label: `Group #${id}` }
      }),
    [options, value]
  )

  return (
    <Combobox
      multiple
      items={options}
      value={selected}
      onValueChange={(next) => {
        onChange((next ?? []).map((option) => option.id))
      }}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled || isPending}
    >
      <ComboboxChips
        ref={anchor}
        className={cn(
          "min-h-11 w-full rounded-sm border border-border bg-transparent px-2.5 py-1.5 shadow-none",
          invalid && "border-destructive"
        )}
        aria-invalid={invalid}
      >
        <ComboboxValue>
          {(selectedValue: EligibleGroupOption[]) => (
            <>
              {selectedValue.map((option) => (
                <ComboboxChip key={option.id}>{option.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={
                  selectedValue.length > 0
                    ? ""
                    : isPending
                      ? "Loading groups..."
                      : options.length === 0
                        ? "No groups yet — create one on Promotions"
                        : "Search and select groups"
                }
                disabled={disabled || isPending}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>
          {isPending
            ? "Loading groups..."
            : "No customer groups found."}
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(option: EligibleGroupOption) => (
              <ComboboxItem key={option.id} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
