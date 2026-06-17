"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type NotificationCheckboxOptionProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description: string
  id: string
}

export function NotificationCheckboxOption({
  checked,
  onCheckedChange,
  label,
  description,
  id,
}: NotificationCheckboxOptionProps) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="mt-1 block text-sm text-muted-foreground">
          {description}
        </span>
      </Label>
    </div>
  )
}
