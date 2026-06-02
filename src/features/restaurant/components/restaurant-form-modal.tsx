"use client"

import { useState } from "react"

import { OpeningHoursEditor } from "@/features/restaurant/components/opening-hours-editor"
import { defaultOpeningHours } from "@/features/restaurant"
import type {
  Restaurant,
  RestaurantFormValues,
} from "@/features/restaurant/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"

type RestaurantFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurant?: Restaurant | null
  onSave?: (values: RestaurantFormValues) => void
}

function createEmptyValues(): RestaurantFormValues {
  return {
    name: "",
    description: "",
    openingHours: defaultOpeningHours.map((row, index) => ({
      ...row,
      id: `new-${row.day}-${index}`,
    })),
  }
}

function restaurantToValues(restaurant: Restaurant): RestaurantFormValues {
  return {
    name: restaurant.name,
    description: restaurant.description,
    openingHours: restaurant.openingHours.map((row) => ({ ...row })),
  }
}

function RestaurantFormModalContent({
  onOpenChange,
  restaurant,
  onSave,
}: Omit<RestaurantFormModalProps, "open">) {
  const isEdit = Boolean(restaurant)
  const [values, setValues] = useState<RestaurantFormValues>(() =>
    restaurant ? restaurantToValues(restaurant) : createEmptyValues()
  )

  const handleSubmit = () => {
    if (!values.name.trim()) {
      toast.error("Restaurant name is required")
      return
    }
    onSave?.(values)
    toast.success(isEdit ? "Restaurant updated" : "Restaurant created")
    onOpenChange(false)
  }

  return (
    <BaseModal
      title={isEdit ? "Edit Restaurant" : "Add New Restaurant"}
      open
      onOpenChange={onOpenChange}
      layout="detail"
      size="lg"
      className="max-w-2xl"
    >
      <div className="space-y-2">
        <Label htmlFor="restaurant-name">Restaurant Name</Label>
        <Input
          id="restaurant-name"
          placeholder="Hometown Eat Hub"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="restaurant-description">Restaurant Description</Label>
        <Textarea
          id="restaurant-description"
          placeholder="Enter a description for this restaurant"
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          rows={4}
          className="resize-none"
        />
      </div>

      <OpeningHoursEditor
        rows={values.openingHours}
        onChange={(openingHours) => setValues((v) => ({ ...v, openingHours }))}
      />

      <Button type="button" className="mt-2 h-11 w-full" onClick={handleSubmit}>
        {isEdit ? "Save changes" : "Add restaurant"}
      </Button>
    </BaseModal>
  )
}

export function RestaurantFormModal({
  open,
  onOpenChange,
  restaurant,
  onSave,
}: RestaurantFormModalProps) {
  if (!open) {
    return null
  }

  return (
    <RestaurantFormModalContent
      key={restaurant?.id ?? "new"}
      restaurant={restaurant}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  )
}
