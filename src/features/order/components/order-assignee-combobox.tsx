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
import type { ApiOrderAssigneeOption } from "@/features/order/types"
import { cn } from "@/lib/utils"

function toAssigneeUserId(assignee: ApiOrderAssigneeOption) {
  return assignee.user_id ?? assignee.id
}

type OrderAssigneeComboboxProps = {
  id?: string
  assignees: ApiOrderAssigneeOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function OrderAssigneeCombobox({
  id,
  assignees,
  value,
  onChange,
  placeholder = "Select assignee",
  className,
  disabled = false,
}: OrderAssigneeComboboxProps) {
  const selectedAssignee = useMemo(
    () =>
      assignees.find(
        (assignee) => String(toAssigneeUserId(assignee)) === value
      ) ?? null,
    [assignees, value]
  )

  return (
    <Combobox
      items={assignees}
      value={selectedAssignee}
      onValueChange={(assignee) =>
        onChange(assignee ? String(toAssigneeUserId(assignee)) : "")
      }
      itemToStringLabel={(assignee) => assignee.name}
      itemToStringValue={(assignee) => String(toAssigneeUserId(assignee))}
      isItemEqualToValue={(a, b) => toAssigneeUserId(a) === toAssigneeUserId(b)}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        showClear={Boolean(value)}
        icon={{ name: "account", position: "left" }}
        disabled={disabled}
        className={cn(
          "w-full [&_[data-slot=input-group]]:h-11 [&_[data-slot=input-group]]:rounded-sm [&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-background",
          className
        )}
      />
      <ComboboxContent>
        <ComboboxEmpty>No assignee found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(assignee: ApiOrderAssigneeOption) => (
              <ComboboxItem
                key={String(toAssigneeUserId(assignee))}
                value={assignee}
              >
                {assignee.name}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
