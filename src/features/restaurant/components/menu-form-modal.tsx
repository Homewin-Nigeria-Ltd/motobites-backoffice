"use client"

import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Menu, MenuFormValues } from "@/features/restaurant/types"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
 
import { toast } from "@/lib/toast"
import { ImageUpload } from "@/components/ui/image-upload"

type MenuFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu?: Menu | null
  onSave?: (values: MenuFormValues) => void
}



const menuFormSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
  description: z.string().optional().default("") ,
  price: z.string().min(1, "Price is required"),
  durationMinutes: z.string().min(1, "Duration is required"),
  enabled: z.boolean().optional().default(true),
  image: z.instanceof(File).nullable().optional(),
})

type MenuFormSchemaValues = z.infer<typeof menuFormSchema>

function getInitialValues(menu?: Menu | null): MenuFormSchemaValues {
  if (!menu) {
    return {
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
      enabled: true,
      image: null,
    }
  }
  return {
    name: menu.name,
    description: menu.description ?? "",
    price: String(menu.price),
    durationMinutes: String(menu.durationMinutes),
    enabled: menu.enabled,
    image: null,
  }
}

function MenuFormModalContent({
  onOpenChange,
  menu,
  onSave,
}: Omit<MenuFormModalProps, "open">) {
  const isEdit = Boolean(menu)

  const modalTitle = isEdit ? "Edit Menu Item" : "Add Menu Item"
  const submitLabel = isEdit ? "Save changes" : "Save and Publish"

  const { handleSubmit, control, setError } = useForm<MenuFormSchemaValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(menuFormSchema as any),
    defaultValues: getInitialValues(menu),
  })

  const onSubmit = async (values: MenuFormSchemaValues) => {
    const payload: MenuFormValues = {
      name: values.name,
      description: values.description ?? "",
      price: values.price,
      durationMinutes: values.durationMinutes,
      enabled: values.enabled ?? true,
    }
    try {
      await onSave?.(payload)
      toast.success(isEdit ? "Menu item updated" : "Menu item added")
      onOpenChange(false)
    } catch (err) {
      const serverErr = err as { fieldErrors?: Record<string, string[] | string>; message?: string }
      if (serverErr.fieldErrors) {
        Object.entries(serverErr.fieldErrors).forEach(([key, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : (msgs as string)
          setError(key as keyof MenuFormSchemaValues, { type: "server", message })
        })
      } else {
        toast.error(serverErr.message ?? "Failed to save menu item")
      }
    }
  }
  
  const onInvalid = (errors: Record<string, unknown>) => {
    const firstKey = Object.keys(errors)[0]
    const el = document.querySelector(`#menu-${firstKey}`) as HTMLElement | null
    el?.focus()
  }

  return (
    <BaseModal
      title={modalTitle}
      open
      onOpenChange={onOpenChange}
      layout="detail"
      size="lg"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel htmlFor="menu-name">Item Name</FieldLabel>
              <Input
                id="menu-name"
                placeholder="Jollof Rice and Chicken"
                className="h-11"
                value={field.value}
                onChange={field.onChange}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="menu-description">Description</FieldLabel>
              <Textarea
                id="menu-description"
                placeholder="Enter a description"
                rows={4}
                className="resize-none"
                value={field.value}
                onChange={field.onChange}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="menu-price">Menu Price (₦)</FieldLabel>
                  <Input
                    id="menu-price"
                    inputMode="decimal"
                    placeholder="2500"
                    className="h-11"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="durationMinutes"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="menu-duration">Duration (minutes)</FieldLabel>
                  <Input
                    id="menu-duration"
                    inputMode="numeric"
                    placeholder="20"
                    className="h-11"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </div>

        <Controller
          name="image"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <div>
              <ImageUpload
                value={field.value ?? null}
                existingImageUrl={menu && !field.value ? undefined : undefined}
                existingImageAlt={menu?.name ?? "Menu item image"}
                onChange={(file) => field.onChange(file)}
              />
            </div>
          )}
        />

        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <FieldLabel htmlFor="menu-enabled" className="cursor-pointer">Available on menu</FieldLabel>
              <Switch id="menu-enabled" checked={field.value} onCheckedChange={field.onChange} />
            </div>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="h-12 rounded-xl px-8 text-base font-semibold">
            {submitLabel}
          </Button>
        </div>
      </form>
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
