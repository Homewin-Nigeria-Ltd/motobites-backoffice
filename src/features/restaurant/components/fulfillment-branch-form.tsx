"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
  fulfillmentBranchFormSchema,
  type FulfillmentBranchFormValues,
} from "@/features/restaurant/schemas/fulfillment-branch-form.schema"
import { deriveBranchFieldsFromPlace } from "@/features/restaurant/utils/derive-branch-from-place"
import { AddressCombobox } from "@/components/address-combobox"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useGooglePlaces } from "@/hooks/use-google-places"
import type { GooglePlaceDetails } from "@/lib/google-place"

type FulfillmentBranchFormProps = {
  defaultValues: FulfillmentBranchFormValues
  isPending: boolean
  submitLabel: string
  pendingLabel: string
  onSubmit: (values: FulfillmentBranchFormValues) => Promise<void>
  formKey: string
}

const submitButtonClassName = "h-12 rounded-xl px-8 text-base font-semibold"

function clearDerivedBranchFields(
  setValue: (
    name: keyof FulfillmentBranchFormValues,
    value: FulfillmentBranchFormValues[keyof FulfillmentBranchFormValues],
  ) => void,
) {
  setValue("key", "")
  setValue("name", "")
  setValue("latitude", Number.NaN)
  setValue("longitude", Number.NaN)
}

export function FulfillmentBranchForm({
  defaultValues,
  isPending,
  submitLabel,
  pendingLabel,
  onSubmit,
  formKey,
}: FulfillmentBranchFormProps) {
  const { hasApiKey } = useGooglePlaces()
  const form = useForm<FulfillmentBranchFormValues>({
    resolver: zodResolver(fulfillmentBranchFormSchema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

  const applyPlaceDetails = (details: GooglePlaceDetails) => {
    const branchFields = deriveBranchFieldsFromPlace(details)

    form.setValue("address", branchFields.address, { shouldValidate: true })
    form.setValue("latitude", branchFields.latitude, { shouldValidate: true })
    form.setValue("longitude", branchFields.longitude, { shouldValidate: true })
    form.setValue("key", branchFields.key, { shouldValidate: true })
    form.setValue("name", branchFields.name, { shouldValidate: true })
  }

  const handleLocationChange = (value: string) => {
    form.setValue("address", value, { shouldValidate: true })
    clearDerivedBranchFields((name, nextValue) => {
      form.setValue(name, nextValue)
    })
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-5">
      <Controller
        control={form.control}
        name="address"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={`${formKey}-branch-location`}>
              Location
            </FieldLabel>
            {hasApiKey ? (
              <AddressCombobox
                id={`${formKey}-branch-location`}
                value={field.value}
                onChange={handleLocationChange}
                onBlur={field.onBlur}
                onPlaceSelect={applyPlaceDetails}
                placeholder="Search location on Google Maps"
                className="h-11"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Google Maps is not configured. Set{" "}
                <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
                to add or edit branches.
              </p>
            )}
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-sm text-muted-foreground">
                Enable this branch for fulfillment
              </p>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
              aria-label="Branch active"
            />
          </div>
        )}
      />

      <Controller
        control={form.control}
        name="isOpen"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Open</p>
              <p className="text-sm text-muted-foreground">
                Mark this branch as currently open
              </p>
            </div>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
              aria-label="Branch open"
            />
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !hasApiKey}
          className={submitButtonClassName}
        >
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  )
}
