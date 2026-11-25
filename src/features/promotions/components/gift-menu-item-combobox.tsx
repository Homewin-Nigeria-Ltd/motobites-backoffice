"use client"

import { useMemo, useState } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useMenuGroupedItems } from "@/features/restaurant/hooks/use-restaurant-queries"

export type GiftMenuItemOption = {
  id: string
  label: string
}

type GiftMenuItemComboboxProps = {
  value: string
  onChange: (id: string) => void
  disabled?: boolean
  invalid?: boolean
  initialOption?: GiftMenuItemOption | null
}

export function GiftMenuItemCombobox({
  value,
  onChange,
  disabled,
  invalid,
  initialOption,
}: GiftMenuItemComboboxProps) {
  const [search, setSearch] = useState("")
  const [pickedOption, setPickedOption] = useState<GiftMenuItemOption | null>(
    null
  )

  const { data: groups = [], isPending } = useMenuGroupedItems({
    sort: "name",
    search: search.trim() || undefined,
  })

  const retainedOption =
    pickedOption?.id === value
      ? pickedOption
      : initialOption?.id === value
        ? initialOption
        : null

  const options = useMemo<GiftMenuItemOption[]>(() => {
    const byId = new Map<string, GiftMenuItemOption>()

    if (retainedOption?.id) {
      byId.set(retainedOption.id, retainedOption)
    }

    const groupList = Array.isArray(groups) ? groups : []

    for (const group of groupList) {
      const rawItems = group?.items
      const items = Array.isArray(rawItems)
        ? rawItems
        : rawItems && typeof rawItems === "object"
          ? Object.values(rawItems)
          : []

      for (const item of items) {
        if (!item || typeof item !== "object" || !("id" in item)) continue

        const id = String((item as { id: unknown }).id)
        const name =
          "name" in item && typeof (item as { name: unknown }).name === "string"
            ? (item as { name: string }).name.trim()
            : ""

        if (!name) continue

        byId.set(id, {
          id,
          label: name,
        })
      }
    }

    return Array.from(byId.values())
  }, [groups, retainedOption])

  const selected =
    options.find((option) => option.id === value) ?? retainedOption

  return (
    <Combobox
      items={options}
      value={selected}
      onValueChange={(next) => {
        setPickedOption(next ?? null)
        onChange(next?.id ?? "")
      }}
      onInputValueChange={setSearch}
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={
          isPending ? "Loading menu items..." : "Search and select menu item"
        }
        showClear={Boolean(value)}
        disabled={disabled}
        aria-invalid={invalid}
        className="h-11"
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isPending ? "Loading menu items..." : "No menu items found."}
        </ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(option: GiftMenuItemOption) => (
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
