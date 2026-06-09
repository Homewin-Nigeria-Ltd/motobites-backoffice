"use client";

import { useMemo } from "react";
import Link from "next/link";

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import { Icons } from "@/components/ui/icons";
import { useRestaurants } from "@/features/restaurant";

type KitchenOption = {
  id: string;
  name: string;
};

type RestaurantComboboxProps = {
  value: string;
  onChange: (kitchenId: string) => void;
  className?: string;
};

export function RestaurantCombobox({
  value,
  onChange,
  className,
}: RestaurantComboboxProps) {
  const { data: restaurants = [] } = useRestaurants();

  const kitchenOptions = useMemo<KitchenOption[]>(
    () =>
      restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
      })),
    [restaurants],
  );

  const selectedKitchen = useMemo(
    () => kitchenOptions.find((kitchen) => kitchen.id === value) ?? null,
    [kitchenOptions, value],
  );

  return (
    <Combobox
      items={kitchenOptions}
      value={selectedKitchen}
      onValueChange={(kitchen) => onChange(kitchen?.id ?? "")}
      itemToStringLabel={(kitchen) => kitchen.name}
      itemToStringValue={(kitchen) => kitchen.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
    >
      <ComboboxInput
        placeholder="Entre Restaurant Or Create New Restaurant"
        showClear={Boolean(value)}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No restaurant found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxItem
            value={{ id: "__create__", name: "Create a New Kitchen" }}
            className="font-medium text-primary"
          >
            <Link
              href="/kitchen"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2"
            >
              <Icons.add size={16} />
              Create a New Kitchen
            </Link>
          </ComboboxItem>
          <ComboboxSeparator />
          <ComboboxCollection>
            {(kitchen: KitchenOption) => (
              <ComboboxItem key={kitchen.id} value={kitchen}>
                {kitchen.name}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
