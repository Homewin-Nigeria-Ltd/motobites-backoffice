"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { InventoryItemQuantityStepper } from "@/features/inventory/components/inventory-item-quantity-stepper"
import {
  inventoryCategories,
  inventoryStockLevels,
} from "@/features/inventory/constants"
import { useUpdateInventoryItem } from "@/features/inventory/hooks/use-inventory-mutations"
import type { ApiInventoryItem, InventoryStockLevel } from "@/features/inventory/types"
import { buildInventoryItemFormData } from "@/features/inventory/utils/build-inventory-item-form-data"
import {
  inventoryItemFormSchema,
} from "@/features/inventory/schemas/inventory-item-form.schema"
import {
  getInventoryItemExistingImageUrl,
  mapApiInventoryItemToFormValues,
  type InventoryItemFormValues,
} from "@/features/inventory/utils/inventory-item-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SlideInModal } from "@/components/ui/slide-in-modal"
import { Textarea } from "@/components/ui/textarea"

type EditInventoryItemSheetProps = {
  item: ApiInventoryItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const selectTriggerClassName = "h-11 w-full"
const submitButtonClassName = "h-12 rounded-xl px-8 text-base font-semibold"

function EditInventoryItemForm({
  item,
  onOpenChange,
}: {
  item: ApiInventoryItem
  onOpenChange: (open: boolean) => void
}) {
  const { updateItem, isPending } = useUpdateInventoryItem()
  const [image, setImage] = useState<File | null>(null)

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: mapApiInventoryItemToFormValues(item),
  })
  const itemName = useWatch({ control: form.control, name: "name" })

  const onSubmit = form.handleSubmit((values) => {
    const payload = buildInventoryItemFormData({
      ...values,
      stock_level: values.stock_level as InventoryStockLevel,
      image,
    })

    updateItem({ itemId: item.id, formData: payload }).then((result) => {
      if (!result.success) {
        return
      }

      onOpenChange(false)
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Item Name (Required)</FieldLabel>
            <Input
              {...field}
              placeholder="Enter item name (e.g. Bag of rice)"
              disabled={isPending}
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              {...field}
              placeholder="Enter a description"
              disabled={isPending}
              rows={4}
            />
          </Field>
        )}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Amount (Required)</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  ₦
                </span>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={1}
                  disabled={isPending}
                  className="pl-8"
                  onChange={(event) =>
                    field.onChange(
                      Math.max(0, Math.round(Number(event.target.value) || 0))
                    )
                  }
                />
              </div>
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="quantity"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Quantity (Required)</FieldLabel>
              <InventoryItemQuantityStepper
                value={field.value}
                disabled={isPending}
                onChange={field.onChange}
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="stock_level"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Stock Level (Required)</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Select stock level" />
              </SelectTrigger>
              <SelectContent>
                {inventoryStockLevels.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="category"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Category (Required)</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {inventoryCategories.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>Image</FieldLabel>
        <ImageUpload
          value={image}
          existingImageUrl={getInventoryItemExistingImageUrl(item)}
          existingImageAlt={itemName || item.name}
          onChange={setImage}
          disabled={isPending}
        />
      </Field>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className={submitButtonClassName}
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

export function EditInventoryItemSheet({
  item,
  open,
  onOpenChange,
}: EditInventoryItemSheetProps) {
  return (
    <SlideInModal
      title="Edit Item"
      panel="standard"
      open={open}
      onOpenChange={onOpenChange}
      closeLabel="Close edit item form"
      bodyClassName="space-y-5"
    >
      {open && item ? (
        <EditInventoryItemForm
          key={item.id}
          item={item}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </SlideInModal>
  )
}
