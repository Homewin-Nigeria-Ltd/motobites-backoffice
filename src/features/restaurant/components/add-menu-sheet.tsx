"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RestaurantCombobox } from "@/features/restaurant/components/restaurant-combobox"
import {
  defaultMenuAvailability,
  defaultMenuTags,
} from "@/features/restaurant"
import type {
  MenuAvailabilityRow,
  MenuVariation,
} from "@/features/restaurant/types"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

function TimeStepper({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground">
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Decrease time"
      >
        <Icons.remove size={14} />
      </button>
      <span className="min-w-[4.5rem] text-center font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value)}
        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Increase time"
      >
        <Icons.add size={14} />
      </button>
    </div>
  )
}

export function AddMenuSheet({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen

  const [menuName, setMenuName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [restaurant, setRestaurant] = React.useState("")
  const [variations, setVariations] = React.useState<MenuVariation[]>([
    { id: "1", optionName: "", price: "", duration: "" },
    { id: "2", optionName: "", price: "", duration: "" },
  ])
  const [tags, setTags] = React.useState<string[]>(defaultMenuTags)
  const [tagInput, setTagInput] = React.useState("")
  const [availability, setAvailability] = React.useState<"all-day" | "custom">(
    "all-day"
  )
  const [startTime, setStartTime] = React.useState("8:00 Am")
  const [endTime, setEndTime] = React.useState("9:00 Pm")
  const [customSchedule, setCustomSchedule] = React.useState<MenuAvailabilityRow[]>(
    defaultMenuAvailability
  )
  const [image, setImage] = React.useState<File | null>(null)

  const addVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        optionName: "",
        price: "",
        duration: "",
      },
    ])
  }

  const updateVariation = (
    id: string,
    field: keyof Omit<MenuVariation, "id">,
    value: string
  ) => {
    setVariations((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags((prev) => [...prev, trimmed])
    setTagInput("")
  }

  const clearTags = () => setTags([])

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const updateCustomSchedule = (
    id: string,
    field: keyof Pick<MenuAvailabilityRow, "startTime" | "endTime">,
    value: string
  ) => {
    setCustomSchedule((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const removeCustomScheduleRow = (id: string) => {
    setCustomSchedule((prev) => prev.filter((row) => row.id !== id))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <SlideInModal
      title="Add Menu"
      panel="standard"
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      closeLabel="Close add menu form"
      asForm
      onSubmit={handleSubmit}
      bodyClassName="space-y-6"
      footer={
        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-12 rounded-xl px-8 text-base font-semibold"
          >
            Save and Publish
          </Button>
        </div>
      }
    >
      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <Label>Menu Name</Label>
          <span className="text-xs text-muted-foreground">Required</span>
        </div>
        <div className="relative">
          <Input
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Entre item name (e.g Jollof rice and chicken with Pepsi)"
            className="h-11 rounded-xl bg-background pr-44"
          />
          <Button
            type="button"
            size="sm"
            icon={{ name: "sparkles", position: "left", size: 14 }}
            className="absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-lg text-xs"
          >
            AI Generated Name
          </Button>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Menu Variation
        </h3>
        <div className="space-y-3">
          {variations.map((row) => (
            <div key={row.id} className="flex items-center gap-3">
              <button
                type="button"
                className="shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                aria-label="Reorder variation"
              >
                <Icons.dragIndicator size={20} />
              </button>
              <Input
                value={row.optionName}
                onChange={(e) =>
                  updateVariation(row.id, "optionName", e.target.value)
                }
                placeholder="Option Name"
                className="h-10 min-w-0 flex-1"
              />
              <div className="flex shrink-0 items-center gap-2">
                <Label>Price</Label>
                <div className="relative w-24">
                  <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                    ₦
                  </span>
                  <Input
                    value={row.price}
                    onChange={(e) =>
                      updateVariation(row.id, "price", e.target.value)
                    }
                    placeholder=""
                    inputMode="decimal"
                    className="h-10 pl-7"
                  />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Label>Duration</Label>
                <div className="relative w-24">
                  <Input
                    value={row.duration}
                    onChange={(e) =>
                      updateVariation(row.id, "duration", e.target.value)
                    }
                    placeholder=""
                    inputMode="numeric"
                    className="h-10 pr-10"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm text-muted-foreground">
                    Min
                  </span>
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
            icon={{ name: "add", position: "left" }}
            onClick={addVariation}
          >
            Add variation
          </Button>
        </div>
      </section>

      <section>
        <Label className="mb-2">Description</Label>
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            rows={4}
            className="block min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
          />
          <div className="flex justify-end px-2 pb-2">
            <Button
              type="button"
              size="sm"
              icon={{ name: "sparkles", position: "left", size: 14 }}
              className="h-8 rounded-lg text-xs"
            >
              AI Generated Description
            </Button>
          </div>
        </div>
      </section>

      <section>
        <Label className="mb-2">Select Restaurant</Label>
        <RestaurantCombobox value={restaurant} onChange={setRestaurant} />
      </section>

      <section className="space-y-5 border-t border-border pt-2">
        <h3 className="text-base font-semibold text-foreground">
          Advance Setting
        </h3>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <Label>Set Custom Tag</Label>
            <button
              type="button"
              onClick={clearTags}
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
            placeholder="Add a tag that best describes your menu"
            className="h-10 rounded-xl"
          />
        </div>

        <div>
          <Label className="mb-2">Set Availability</Label>
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setAvailability("all-day")}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium transition-all",
                availability === "all-day"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Day
            </button>
            <button
              type="button"
              onClick={() => setAvailability("custom")}
              className={cn(
                "rounded-md px-5 py-2 text-sm font-medium transition-all",
                availability === "custom"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Custom
            </button>
          </div>
          {availability === "all-day" && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Everyday</span>
              <TimeStepper value={startTime} onChange={setStartTime} />
              <span>to</span>
              <TimeStepper value={endTime} onChange={setEndTime} />
            </div>
          )}
          {availability === "custom" && (
            <div className="mt-4 space-y-3">
              {customSchedule.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-28 shrink-0 font-medium text-foreground">
                    {row.day}
                  </span>
                  <TimeStepper
                    value={row.startTime}
                    onChange={(value) =>
                      updateCustomSchedule(row.id, "startTime", value)
                    }
                  />
                  <span>to</span>
                  <TimeStepper
                    value={row.endTime}
                    onChange={(value) =>
                      updateCustomSchedule(row.id, "endTime", value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                    aria-label={`Remove ${row.day} availability`}
                    onClick={() => removeCustomScheduleRow(row.id)}
                  >
                    <Icons.trash size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <ImageUpload value={image} onChange={setImage} />
        </div>
      </section>
    </SlideInModal>
  )
}
