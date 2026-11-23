"use client"

import { useMemo, useState } from "react"

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
import { useCustomerList } from "@/features/customers"
import { cn } from "@/lib/utils"

export type EligibleCustomerOption = {
  id: string
  label: string
}

type EligibleCustomersComboboxProps = {
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  invalid?: boolean
  initialOptions?: EligibleCustomerOption[]
}

export function EligibleCustomersCombobox({
  value,
  onChange,
  disabled,
  invalid,
  initialOptions = [],
}: EligibleCustomersComboboxProps) {
  const anchor = useComboboxAnchor()
  const [search, setSearch] = useState("")
  const { data, isPending } = useCustomerList({
    page: 1,
    per_page: 50,
    tab: "all",
    search: search.trim() || undefined,
  })

  const options = useMemo<EligibleCustomerOption[]>(() => {
    const byId = new Map(
      initialOptions.map((option) => [String(option.id), option])
    )

    for (const customer of data?.items ?? []) {
      byId.set(String(customer.id), {
        id: String(customer.id),
        label: `${customer.name} · #${customer.id}`,
      })
    }

    return Array.from(byId.values())
  }, [data?.items, initialOptions])

  const selected = useMemo(
    () =>
      value.map((id) => {
        const normalizedId = String(id)
        const match = options.find((option) => option.id === normalizedId)
        return match ?? { id: normalizedId, label: `Customer #${normalizedId}` }
      }),
    [options, value]
  )

  const items = useMemo(() => {
    const byId = new Map(options.map((option) => [option.id, option]))
    for (const option of selected) {
      if (!byId.has(option.id)) {
        byId.set(option.id, option)
      }
    }
    return Array.from(byId.values())
  }, [options, selected])

  return (
    <Combobox
      multiple
      items={items}
      value={selected}
      onValueChange={(next) => {
        const nextValue = Array.isArray(next) ? next : next ? [next] : []
        onChange(nextValue.map((option) => option.id))
      }}
      onInputValueChange={setSearch}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled}
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
          {(selectedValue: EligibleCustomerOption[]) => (
            <>
              {selectedValue.map((option) => (
                <ComboboxChip key={option.id}>{option.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={
                  selectedValue.length > 0
                    ? ""
                    : isPending
                      ? "Loading customers..."
                      : "Search and select customers"
                }
                disabled={disabled}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>
          {isPending ? "Loading customers..." : "No customers found."}
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(option: EligibleCustomerOption) => (
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
