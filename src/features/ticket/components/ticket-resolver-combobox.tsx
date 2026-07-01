"use client"

import { useMemo } from "react"

import type { StaffMember } from "@/features/staff/types"
import {
  findStaffByResolverId,
  getStaffResolverId,
} from "@/features/ticket/utils/staff-resolver"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type TicketResolverComboboxProps = {
  id?: string
  staff: StaffMember[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  allowClear?: boolean
}

export function TicketResolverCombobox({
  id,
  staff,
  value,
  onChange,
  placeholder = "Select staff member",
  className,
  disabled = false,
  allowClear = true,
}: TicketResolverComboboxProps) {
  const selectedStaff = useMemo(
    () => findStaffByResolverId(staff, value),
    [staff, value]
  )

  return (
    <Combobox
      items={staff}
      value={selectedStaff}
      onValueChange={(member) =>
        onChange(member ? String(getStaffResolverId(member)) : "")
      }
      itemToStringLabel={(member) => member.name}
      itemToStringValue={(member) => String(getStaffResolverId(member))}
      isItemEqualToValue={(a, b) => a.userId === b.userId}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        showClear={allowClear && Boolean(value)}
        icon={{ name: "account", position: "left" }}
        disabled={disabled}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No staff member found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(member: StaffMember) => (
              <ComboboxItem key={member.userId} value={member}>
                <div className="min-w-0">
                  <p className="truncate">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
