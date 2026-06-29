"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  giftcardCategoryOptions,
  PROMOTIONS_ROUTES,
} from "@/features/promotions/constants"
import {
  useCreateGiftcard,
  useUpdateGiftcard,
} from "@/features/promotions/hooks/use-promotion-mutations"
import {
  giftcardFormDefaults,
  giftcardFormSchema,
  type GiftcardFormValues,
} from "@/features/promotions/schemas/giftcard-form.schema"
import { buildGiftcardFormData } from "@/features/promotions/utils/build-giftcard-form-data"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const selectTriggerClassName = "h-11 w-full"
const submitButtonClassName = "h-12 rounded-xl px-8 text-base font-semibold"

type GiftcardFormProps =
  | { mode: "create" }
  | {
      mode: "edit"
      giftcardId: string
      defaultValues: GiftcardFormValues
      existingImageUrl?: string | null
    }

export function GiftcardForm(props: GiftcardFormProps) {
  const router = useRouter()
  const { createGiftcard, isPending: isCreating } = useCreateGiftcard()
  const { updateGiftcard, isPending: isUpdating } = useUpdateGiftcard()
  const [image, setImage] = useState<File | null>(null)
  const isPending = props.mode === "create" ? isCreating : isUpdating

  const form = useForm<GiftcardFormValues>({
    resolver: zodResolver(giftcardFormSchema),
    defaultValues:
      props.mode === "edit" ? props.defaultValues : giftcardFormDefaults,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildGiftcardFormData({
      ...values,
      image,
      imageUrl: props.mode === "edit" ? props.existingImageUrl : null,
    })

    const result =
      props.mode === "create"
        ? await createGiftcard(payload)
        : await updateGiftcard({
            giftcardId: props.giftcardId,
            formData: payload,
          })

    if (!result.success) {
      return
    }

    router.push(PROMOTIONS_ROUTES.list)
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Controller
        control={form.control}
        name="themeName"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Theme Name</FieldLabel>
            <Input
              {...field}
              placeholder="Enter theme name"
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
        name="name"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input {...field} placeholder="Enter gift card name" disabled={isPending} />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input {...field} placeholder="Enter gift card title" disabled={isPending} />
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
            <FieldLabel>Category</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {giftcardCategoryOptions.map((option) => (
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
        name="amount"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input
              {...field}
              type="number"
              min={1}
              step={1}
              placeholder="Enter amount"
              disabled={isPending}
              onChange={(event) => field.onChange(event.target.value)}
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Field>
        <FieldLabel>Gift Card Image</FieldLabel>
        <ImageUpload
          value={image}
          existingImageUrl={
            props.mode === "edit" ? props.existingImageUrl : null
          }
          existingImageAlt="Current gift card image"
          onChange={setImage}
          disabled={isPending}
        />
      </Field>

      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <Label htmlFor="giftcard-active">Active</Label>
              <p className="text-sm text-muted-foreground">
                Make this gift card available to customers.
              </p>
            </div>
            <Switch
              id="giftcard-active"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
            />
          </div>
        )}
      />

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className={submitButtonClassName}
          disabled={isPending}
        >
          {props.mode === "create" ? "Create Gift Card" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
