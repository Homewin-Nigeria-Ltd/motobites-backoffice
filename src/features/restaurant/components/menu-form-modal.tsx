"use client"

import { useState } from "react"

import type {
  Menu,
  MenuFormValues,
} from "@/features/restaurant/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/lib/toast"

type MenuFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu?: Menu | null
  onSave?: (values: MenuFormValues) => void
}

const emptyValues: MenuFormValues = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
  enabled: true,
}

function menuToValues(menu: Menu): MenuFormValues {
  return {
    name: menu.name,
    description: menu.description,
    price: String(menu.price),
    durationMinutes: String(menu.durationMinutes),
    enabled: menu.enabled,
  }
}

function MenuFormModalContent({
  onOpenChange,
  menu,
  onSave,
}: Omit<MenuFormModalProps, "open">) {
  const isEdit = Boolean(menu)
  const [values, setValues] = useState<MenuFormValues>(() =>
    menu ? menuToValues(menu) : emptyValues
  )

  const handleSubmit = () => {
    if (!values.name.trim() || !values.price.trim() || !values.durationMinutes.trim()) {
      toast.error("Please fill in all required fields")
      return
    }
    onSave?.(values)
    toast.success(isEdit ? "Menu item updated" : "Menu item added")
    onOpenChange(false)
  }

  return (
    <BaseModal
      title={isEdit ? "Edit Menu Item" : "Add Menu Item"}
      open
      onOpenChange={onOpenChange}
      layout="detail"
      size="lg"
      className="max-w-2xl"
    >
      <div className="space-y-2">
        <Label htmlFor="menu-name">Item Name</Label>
        <Input
          id="menu-name"
          placeholder="Jollof Rice and Chicken"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menu-description">Description</Label>
        <Textarea
          id="menu-description"
          placeholder="Enter a description"
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="menu-price">Menu Price (₦)</Label>
          <Input
            id="menu-price"
            inputMode="decimal"
            placeholder="2500"
            value={values.price}
            onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="menu-duration">Duration (minutes)</Label>
          <Input
            id="menu-duration"
            inputMode="numeric"
            placeholder="20"
            value={values.durationMinutes}
            onChange={(e) =>
              setValues((v) => ({ ...v, durationMinutes: e.target.value }))
            }
            className="h-11"
          />
        </div>
      </div>

      <label
        htmlFor="menu-image-upload"
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-secondary px-6 py-10 text-center transition-colors hover:bg-secondary/80"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
          <Icons.upload size={28} className="text-primary" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Upload Files</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click or drag image to upload. PNG and JPG are allowed.
          </p>
        </div>
        <input id="menu-image-upload" type="file" accept="image/*" className="sr-only" />
      </label>

      <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
        <Label htmlFor="menu-enabled" className="cursor-pointer">
          Available on menu
        </Label>
        <Switch
          id="menu-enabled"
          checked={values.enabled}
          onCheckedChange={(enabled) => setValues((v) => ({ ...v, enabled }))}
        />
      </div>

      <Button type="button" className="mt-2 h-11 w-full" onClick={handleSubmit}>
        {isEdit ? "Save changes" : "Add menu item"}
      </Button>
    </BaseModal>
  )
}

export function MenuFormModal({
  open,
  onOpenChange,
  menu,
  onSave,
}: MenuFormModalProps) {
  if (!open) {
    return null
  }

  return (
    <MenuFormModalContent
      key={menu?.id ?? "new"}
      menu={menu}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  )
}
