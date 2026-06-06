"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CustomTagInputProps = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  label?: string
}

export function CustomTagInput({
  value,
  onChange,
  placeholder = "Add a tag that best describes your menu",
  label = "Set Custom Tag",
}: CustomTagInputProps) {
  const tags = Array.isArray(value) ? value : []
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed)) {
      return
    }

    onChange([...tags, trimmed])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear Selection
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="h-auto gap-1 rounded-full px-3 py-1 text-sm font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-primary/10"
              aria-label={`Remove ${tag} tag`}
            >
              <Icons.close size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            addTag()
          }
        }}
        placeholder={placeholder}
        className="h-10 rounded-xl"
      />
    </div>
  )
}
