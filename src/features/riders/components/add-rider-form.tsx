"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useCreateRider } from "../hooks/use-create-rider"
import {
  addRiderDefaultValues,
  addRiderSchema,
  type AddRiderFormValues,
} from "../schemas/add-rider.schema"
import {
  riderBankOptions,
  riderGenderOptionsList,
} from "./rider-form-options"
import { RiderFormSection } from "./rider-form-section"
import { AddressCombobox } from "@/components/address-combobox"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"

export function AddRiderForm() {
  const { createRider, isPending } = useCreateRider()

  const form = useForm<AddRiderFormValues>({
    resolver: zodResolver(addRiderSchema),
    defaultValues: addRiderDefaultValues,
  })

  const onSubmit = async (values: AddRiderFormValues) => {
    await createRider(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
      <RiderFormSection
        title="Personal Information"
        description="Complete the form below to add a new rider to your delivery team."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-rider-first-name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="add-rider-first-name"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-rider-last-name">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="add-rider-last-name"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-rider-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="add-rider-email"
                type="email"
                placeholder="Input details here"
                className="h-11 bg-muted/50"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-rider-password">Password</FieldLabel>
              <Input
                {...field}
                id="add-rider-password"
                type="password"
                placeholder="Input details here"
                className="h-11"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => {
            const selectedGender =
              riderGenderOptionsList.find((option) => option.value === field.value) ??
              null

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Gender</FieldLabel>
                <Combobox
                  items={riderGenderOptionsList}
                  value={selectedGender}
                  onValueChange={(option) => {
                    if (option) {
                      field.onChange(option.value)
                    }
                  }}
                  itemToStringLabel={(option) => option.label}
                  itemToStringValue={(option) => option.value}
                  isItemEqualToValue={(a, b) => a.value === b.value}
                  disabled={isPending}
                >
                  <ComboboxInput
                    placeholder="Select gender"
                    className="h-11"
                    icon={{ name: "account", position: "left" }}
                    showClear={false}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No gender found.</ComboboxEmpty>
                    <ComboboxList>
                      <ComboboxCollection>
                        {(option: (typeof riderGenderOptionsList)[number]) => (
                          <ComboboxItem key={option.value} value={option}>
                            {option.label}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="dateOfBirth"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-rider-dob">Date of Birth</FieldLabel>
                <DatePicker
                  id="add-rider-dob"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date of birth"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-rider-phone">Contact Details</FieldLabel>
                <Input
                  {...field}
                  id="add-rider-phone"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="houseAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-rider-address">Residents Address</FieldLabel>
              <AddressCombobox
                id="add-rider-address"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Search address"
                className="h-11"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="proofOfAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Proof of Address</FieldLabel>
              <ImageUpload
                value={field.value ?? null}
                onChange={(file) => {
                  field.onChange(file)
                  form.clearErrors("proofOfAddress")
                }}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </RiderFormSection>

      <RiderFormSection
        title="Guarantor Information"
        description="Provide details of the rider's guarantor for verification and accountability."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="guarantorFirstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-guarantor-first-name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="add-guarantor-first-name"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="guarantorLastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-guarantor-last-name">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="add-guarantor-last-name"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="guarantorEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-guarantor-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="add-guarantor-email"
                type="email"
                placeholder="Input details here"
                className="h-11 bg-muted/50"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="guarantorPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-guarantor-phone">Telephone</FieldLabel>
              <Input
                {...field}
                id="add-guarantor-phone"
                placeholder="Input details here"
                className="h-11"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Must not be a relative
              </p>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="guarantorRelationship"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-guarantor-relationship">Relationship</FieldLabel>
              <Input
                {...field}
                id="add-guarantor-relationship"
                placeholder="Mentor"
                className="h-11"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="guarantorAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-guarantor-address">Residents Address</FieldLabel>
              <AddressCombobox
                id="add-guarantor-address"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Search address"
                className="h-11"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="guarantorProofOfAddress"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Proof of Address</FieldLabel>
              <ImageUpload
                value={field.value ?? null}
                onChange={(file) => {
                  field.onChange(file)
                  form.clearErrors("guarantorProofOfAddress")
                }}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </RiderFormSection>

      <RiderFormSection
        title="Identification Document"
        description="Upload the rider's valid identification for verification."
      >
        <Controller
          name="nin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-rider-nin">NIN</FieldLabel>
              <Input
                {...field}
                id="add-rider-nin"
                placeholder="12345678901"
                className="h-11"
                maxLength={11}
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="driverLicense"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Driver&apos;s License</FieldLabel>
              <ImageUpload
                value={field.value ?? null}
                onChange={(file) => {
                  field.onChange(file)
                  form.clearErrors("driverLicense")
                }}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </RiderFormSection>

      <RiderFormSection
        title="Bank Account Details"
        description="Enter the rider's bank account information for payouts and settlements."
        className="pb-0"
      >
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="bankAccountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="add-bank-account-number">
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  id="add-bank-account-number"
                  placeholder="Input details here"
                  className="h-11"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="bankName"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedBank =
                riderBankOptions.find((option) => option.value === field.value) ??
                null

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bank Name</FieldLabel>
                  <Combobox
                    items={riderBankOptions}
                    value={selectedBank}
                    onValueChange={(option) => {
                      if (option) {
                        field.onChange(option.value)
                      }
                    }}
                    itemToStringLabel={(option) => option.label}
                    itemToStringValue={(option) => option.value}
                    isItemEqualToValue={(a, b) => a.value === b.value}
                    disabled={isPending}
                  >
                    <ComboboxInput
                      placeholder="Select Bank"
                      className="h-11"
                      showClear={false}
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No bank found.</ComboboxEmpty>
                      <ComboboxList>
                        <ComboboxCollection>
                          {(option: (typeof riderBankOptions)[number]) => (
                            <ComboboxItem key={option.value} value={option}>
                              {option.label}
                            </ComboboxItem>
                          )}
                        </ComboboxCollection>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )
            }}
          />
        </FieldGroup>

        <Controller
          name="bankAccountName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="add-bank-account-name">Account Name</FieldLabel>
              <Input
                {...field}
                id="add-bank-account-name"
                placeholder="Input details here"
                className="h-11 bg-muted/50"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </RiderFormSection>

      <div className="flex justify-end pt-8">
        <Button
          type="submit"
          size="lg"
          className="min-w-44 rounded-xl"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save and Publish"}
        </Button>
      </div>
    </form>
  )
}
