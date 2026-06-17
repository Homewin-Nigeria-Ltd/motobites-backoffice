"use client"

import { Input } from "@/components/ui/input"

type PermissionsSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function PermissionsSearchInput({
  value,
  onChange,
  placeholder = "Search for anything under control and permission",
}: PermissionsSearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      icon={{ name: "search", position: "left" }}
      className="h-11"
    />
  )
}
