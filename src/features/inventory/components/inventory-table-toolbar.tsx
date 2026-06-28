"use client"

import {
  inventoryListCategoryFilters,
  inventoryListStockFilters,
} from "@/features/inventory/constants"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type InventoryTableToolbarProps = {
  search: string
  category: string
  stockLevel: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStockLevelChange: (value: string) => void
  onExportCsv: () => void
  isExportDisabled?: boolean
}

const selectTriggerClassName = "h-10 w-full"

export function InventoryTableToolbar({
  search,
  category,
  stockLevel,
  onSearchChange,
  onCategoryChange,
  onStockLevelChange,
  onExportCsv,
  isExportDisabled = false,
}: InventoryTableToolbarProps) {
  const hasActiveFilters = Boolean(category || stockLevel)

  const clearFilters = () => {
    onCategoryChange("")
    onStockLevelChange("")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        type="search"
        icon={{ name: "search", position: "left" }}
        placeholder="Search"
        className="h-11 bg-background sm:max-w-md"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-11 border-primary px-5 text-primary hover:bg-primary/5 hover:text-primary",
                hasActiveFilters && "bg-primary/5"
              )}
            >
              <Icon name="filter" size={16} />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72">
            <div className="space-y-4">
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={category || "all"}
                  onValueChange={(value) =>
                    onCategoryChange(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryListCategoryFilters.map((option) => (
                      <SelectItem
                        key={option.value || "all"}
                        value={option.value || "all"}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Stock level</FieldLabel>
                <Select
                  value={stockLevel || "all"}
                  onValueChange={(value) =>
                    onStockLevelChange(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryListStockFilters.map((option) => (
                      <SelectItem
                        key={option.value || "all"}
                        value={option.value || "all"}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-full"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          className="h-11 px-5"
          icon={{ name: "download", position: "left" }}
          disabled={isExportDisabled}
          onClick={onExportCsv}
        >
          Export CSV
        </Button>
      </div>
    </div>
  )
}
