"use client"

import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"

type NotificationRadioOptionProps = {
  value: string
  label: string
  description?: string
  id: string
}

export function NotificationRadioOption({
  value,
  label,
  description,
  id,
}: NotificationRadioOptionProps) {
  return (
    <div className="flex items-start gap-3">
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </Label>
    </div>
  )
}
