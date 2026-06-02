"use client"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"
import { Icons } from "@/components/ui/icons"
import { restaurantOptions } from "@/features/restaurant"
import { cn } from "@/lib/utils"

const CREATE_RESTAURANT_VALUE = "__create_restaurant__"

type RestaurantComboboxProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RestaurantCombobox({
  value,
  onChange,
  className,
}: RestaurantComboboxProps) {
  return (
    <Combobox
      items={restaurantOptions}
      value={value || null}
      onValueChange={(selected) => {
        if (selected === CREATE_RESTAURANT_VALUE) {
          onChange("")
          return
        }
        onChange(selected ?? "")
      }}
    >
      <ComboboxInput
        placeholder="Entre Restaurant Or Create New Restaurant"
        showClear={Boolean(value)}
        className={cn(
          "w-full h-11 rounded-sm border border-border bg-background",
          className
        )}
      />
      <ComboboxContent>
        <ComboboxEmpty>No restaurant found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem
            value={CREATE_RESTAURANT_VALUE}
            className="font-medium text-primary"
          >
            <Icons.add size={16} />
            Create a New restaurant
          </ComboboxItem>
          <ComboboxSeparator />
          <ComboboxCollection>
            {(restaurant: string) => (
              <ComboboxItem key={restaurant} value={restaurant}>
                {restaurant}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
