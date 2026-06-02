"use client"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { staffRoles } from "@/features/staff/types"
import { cn } from "@/lib/utils"

type RoleComboboxProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RoleCombobox({
  id,
  value,
  onChange,
  className,
}: RoleComboboxProps) {
  return (
    <Combobox
      items={[...staffRoles]}
      value={value || null}
      onValueChange={(selected) => onChange(selected ?? "")}
    >
      <ComboboxInput
        id={id}
        placeholder="Select Role"
        showClear={Boolean(value)}
        icon={{ name: "group", position: "left" }}
        className={cn(
          "w-full [&_[data-slot=input-group]]:h-11 [&_[data-slot=input-group]]:rounded-sm [&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-background",
          className
        )}
      />
      <ComboboxContent>
        <ComboboxEmpty>No role found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(role: string) => (
              <ComboboxItem key={role} value={role}>
                {role}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
