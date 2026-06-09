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
import { useStaffRoles } from "@/features/staff/hooks/use-staff-roles"
import type { StaffRoleOption } from "@/features/staff/types"

type RoleComboboxProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  "aria-invalid"?: boolean
}

export function RoleCombobox({
  id,
  value,
  onChange,
  className,
  disabled = false,
  "aria-invalid": ariaInvalid,
}: RoleComboboxProps) {
  const { data: roles = [], isLoading } = useStaffRoles()

  const selectedRole = useMemo(
    () => roles.find((role) => role.key === value) ?? null,
    [roles, value]
  )

  return (
    <Combobox
      items={roles}
      value={selectedRole}
      onValueChange={(role) => onChange(role?.key ?? "")}
      itemToStringLabel={(role) => role.label}
      itemToStringValue={(role) => role.key}
      isItemEqualToValue={(a, b) => a.key === b.key}
      disabled={disabled || isLoading}
    >
      <ComboboxInput
        id={id}
        placeholder={isLoading ? "Loading roles..." : "Select Role"}
        showClear={Boolean(value)}
        icon={{ name: "group", position: "left" }}
        aria-invalid={ariaInvalid}
        disabled={disabled || isLoading}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No role found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(role: StaffRoleOption) => (
              <ComboboxItem key={role.key} value={role}>
                {role.label}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
