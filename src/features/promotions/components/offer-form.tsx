"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startOfDay } from "date-fns"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"

import {
  offerDetailOptions,
  offerRestrictionOptions,
  PROMOTIONS_ROUTES,
} from "@/features/promotions/constants"
import {
  useCreateOffer,
  useUpdateOffer,
} from "@/features/promotions/hooks/use-promotion-mutations"
import {
  createOfferFormDefaults,
  createOfferFormSchema,
  type CreateOfferFormValues,
} from "@/features/promotions/schemas/create-offer.schema"
import { buildOfferInput } from "@/features/promotions/utils/build-offer-payload"
import { useRestaurants } from "@/features/restaurant/hooks/use-restaurant-queries"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AppLoader } from "@/components/ui/app-loader"

const selectTriggerClassName = "h-11 w-full"
const submitButtonClassName = "h-12 rounded-xl px-8 text-base font-semibold"

function parseIsoDate(value?: string) {
  if (!value) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

type OfferFormProps =
  | { mode: "create" }
  | {
      mode: "edit"
      offerId: string
      defaultValues: CreateOfferFormValues
      isActive: boolean
    }

export function OfferForm(props: OfferFormProps) {
  const router = useRouter()
  const { createOffer, isPending: isCreating } = useCreateOffer()
  const { updateOffer, isPending: isUpdating } = useUpdateOffer()
  const { data: kitchens = [], isPending: isKitchensPending } = useRestaurants()
  const isPending = props.mode === "create" ? isCreating : isUpdating

  const form = useForm<CreateOfferFormValues>({
    resolver: zodResolver(createOfferFormSchema),
    defaultValues:
      props.mode === "edit" ? props.defaultValues : createOfferFormDefaults,
  })

  const restriction = useWatch({ control: form.control, name: "restriction" })
  const startDate = useWatch({ control: form.control, name: "startDate" })

  const onSubmit = form.handleSubmit((values) => {
    const payload = buildOfferInput(values, {
      isActive: props.mode === "edit" ? props.isActive : true,
    })

    if (props.mode === "create") {
      createOffer(payload).then((result) => {
        if (!result.success) {
          return
        }

        router.push(PROMOTIONS_ROUTES.list)
      })
      return
    }

    updateOffer({ offerId: props.offerId, input: payload }).then((result) => {
      if (!result.success) {
        return
      }

      router.push(PROMOTIONS_ROUTES.list)
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Controller
        control={form.control}
        name="promotionName"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Promotion Name</FieldLabel>
            <Input
              {...field}
              placeholder="Enter Promotion name"
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
        name="promotionDescription"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Promotion Description</FieldLabel>
            <Textarea
              {...field}
              placeholder="Enter a description Promotion for this promotion"
              disabled={isPending}
              rows={4}
            />
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Controller
          control={form.control}
          name="details"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Details</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger className={selectTriggerClassName}>
                  <SelectValue placeholder="Select details" />
                </SelectTrigger>
                <SelectContent>
                  {offerDetailOptions.map((option) => (
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
          name="startDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Start Date</FieldLabel>
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
          name="endDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>End Date</FieldLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select end date"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                isDateDisabled={(date) => {
                  const minDate = parseIsoDate(startDate) ?? new Date()
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
        name="promoCode"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Promo Code</FieldLabel>
            <Input
              {...field}
              placeholder="Enter promo code"
              disabled={isPending}
              className="h-11 bg-primary/10 font-medium uppercase text-primary"
              onChange={(event) =>
                field.onChange(event.target.value.toUpperCase())
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
        name="restriction"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Restrictions</FieldLabel>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
              className="gap-4"
            >
              {offerRestrictionOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`offer-restriction-${option.value}`}
                  />
                  <Label
                    htmlFor={`offer-restriction-${option.value}`}
                    className="cursor-pointer text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {fieldState.error ? (
              <FieldError>{fieldState.error.message}</FieldError>
            ) : null}
          </Field>
        )}
      />

      {restriction === "specific_kitchen" ? (
        <Controller
          control={form.control}
          name="kitchenId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Kitchen</FieldLabel>
              {isKitchensPending ? (
                <AppLoader className="py-4" spinnerClassName="size-5" />
              ) : (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending || kitchens.length === 0}
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder="Select kitchen" />
                  </SelectTrigger>
                  <SelectContent>
                    {kitchens.map((kitchen) => (
                      <SelectItem key={kitchen.id} value={kitchen.id}>
                        {kitchen.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {fieldState.error ? (
                <FieldError>{fieldState.error.message}</FieldError>
              ) : null}
            </Field>
          )}
        />
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className={submitButtonClassName}
        >
          {isPending
            ? "Saving..."
            : props.mode === "create"
              ? "Save and Publish"
              : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
