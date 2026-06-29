"use client"

import { format } from "date-fns"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function parseIsoDate(value?: string) {
  if (!value) return undefined

  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const date = new Date(year, month - 1, day)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

type DatePickerProps = {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  "aria-invalid"?: boolean
  isDateDisabled?: (date: Date) => boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  id,
  className,
  "aria-invalid": ariaInvalid,
  isDateDisabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = parseIsoDate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "h-11 w-full justify-start rounded-sm border-border bg-transparent px-2.5 text-left font-normal hover:bg-muted/40",
            !selectedDate && "text-muted-foreground",
            ariaInvalid && "border-destructive",
            className
          )}
          icon={{ name: "calendar", position: "left", size: 16 }}
        >
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={selectedDate}
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onChange(toIsoDate(date))
              setOpen(false)
            }
          }}
          disabled={isDateDisabled ?? ((date) => date > new Date())}
        />
      </PopoverContent>
    </Popover>
  )
}
