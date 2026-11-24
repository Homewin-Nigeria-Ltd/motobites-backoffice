"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startOfDay } from "date-fns"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"

import { GiftMenuItemCombobox } from "@/features/promotions/components/gift-menu-item-combobox"
import { PROMOTIONS_ROUTES } from "@/features/promotions/constants"
import {
  useCreateSpecialGiftOffer,
  useUpdateSpecialGiftOffer,
} from "@/features/promotions/hooks/use-promotion-mutations"
import {
  specialGiftOfferFormDefaults,
  specialGiftOfferFormSchema,
  type SpecialGiftOfferFormValues,
} from "@/features/promotions/schemas/special-gift-offer-form.schema"
import { buildSpecialGiftOfferInput } from "@/features/promotions/utils/build-special-gift-offer-payload"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const submitButtonClassName = "h-12 rounded-xl px-8 text-base font-semibold"

function parseIsoDate(value?: string) {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

type SpecialGiftOfferFormProps =
  | { mode: "create" }
  | {
      mode: "edit"
      offerId: string
      defaultValues: SpecialGiftOfferFormValues
      giftMenuItemLabel?: string | null
    }

export function SpecialGiftOfferForm(props: SpecialGiftOfferFormProps) {
  const router = useRouter()
  const { createSpecialGiftOffer, isPending: isCreating } =
    useCreateSpecialGiftOffer()
  const { updateSpecialGiftOffer, isPending: isUpdating } =
    useUpdateSpecialGiftOffer()
  const isPending = props.mode === "create" ? isCreating : isUpdating

  const form = useForm<SpecialGiftOfferFormValues>({
    resolver: zodResolver(specialGiftOfferFormSchema),
    defaultValues:
      props.mode === "edit" ? props.defaultValues : specialGiftOfferFormDefaults,
  })

  const startsAt = useWatch({ control: form.control, name: "startsAt" })

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildSpecialGiftOfferInput(values)

    const result =
      props.mode === "create"
        ? await createSpecialGiftOffer(payload)
        : await updateSpecialGiftOffer({
            offerId: props.offerId,
            input: payload,
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
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...field}
              placeholder="e.g. Free drink with orders over ₦10,000"
              disabled={isPending}
              className="h-11"
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="minimumBasketValue"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="max-w-sm">
            <FieldLabel>Minimum basket value (₦)</FieldLabel>
            <Input
              {...field}
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 10000"
              disabled={isPending}
              className="h-11"
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="giftMenuItemId"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Gift menu item</FieldLabel>
            <GiftMenuItemCombobox
              value={field.value}
              onChange={field.onChange}
              disabled={isPending}
              invalid={fieldState.invalid}
              initialOption={
                props.mode === "edit" && field.value
                  ? {
                      id: field.value,
                      label:
                        props.giftMenuItemLabel ||
                        `Menu item #${field.value}`,
                    }
                  : null
              }
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="giftQuantity"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="max-w-sm">
            <FieldLabel>Gift quantity</FieldLabel>
            <Input
              {...field}
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 1"
              disabled={isPending}
              className="h-11"
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={form.control}
          name="startsAt"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Starts at</FieldLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select start date"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                isDateDisabled={(date) => date < startOfDay(new Date())}
              />
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="endsAt"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Ends at</FieldLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select end date"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                isDateDisabled={(date) => {
                  const minDate = parseIsoDate(startsAt) ?? new Date()
                  return date < startOfDay(minDate)
                }}
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
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <Label htmlFor="special-offer-active">Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive offers stay hidden from customers.
              </p>
            </div>
            <Switch
              id="special-offer-active"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
            />
          </div>
        )}
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          className={submitButtonClassName}
          onClick={() => router.push(PROMOTIONS_ROUTES.list)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className={submitButtonClassName}
        >
          {isPending
            ? "Saving..."
            : props.mode === "edit"
              ? "Save changes"
              : "Create special offer"}
        </Button>
      </div>
    </form>
  )
}
