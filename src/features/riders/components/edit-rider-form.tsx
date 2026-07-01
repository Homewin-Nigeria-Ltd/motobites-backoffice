"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateRider } from "../hooks/use-update-rider"
import {
  updateRiderSchema,
  type UpdateRiderFormValues,
} from "../schemas/add-rider.schema"
import {
  riderBankOptions,
  riderGenderOptionsList,
  type RiderExistingFiles,
} from "./rider-form-options"
import { RiderFormSection } from "./rider-form-section"
import { BranchCombobox } from "@/features/restaurant/components/branch-combobox"
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

type EditRiderFormProps = {
  riderId: number
  defaultValues: UpdateRiderFormValues
  existingFiles?: RiderExistingFiles
}

export function EditRiderForm({
  riderId,
  defaultValues,
  existingFiles,
}: EditRiderFormProps) {
  const { updateRider, isPending } = useUpdateRider()

  const form = useForm<UpdateRiderFormValues>({
    resolver: zodResolver(updateRiderSchema),
    defaultValues,
  })

  React.useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const onSubmit = async (values: UpdateRiderFormValues) => {
    await updateRider(riderId, values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
      <RiderFormSection
        title="Personal Information"
        description="Update the rider's personal details and contact information."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-rider-first-name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-rider-first-name"
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
                <FieldLabel htmlFor="edit-rider-last-name">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-rider-last-name"
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
              <FieldLabel htmlFor="edit-rider-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="edit-rider-email"
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
          name="branchId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-rider-branch">Branch</FieldLabel>
              <BranchCombobox
                id="edit-rider-branch"
                value={field.value}
                onChange={field.onChange}
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
              <FieldLabel htmlFor="edit-rider-password">Password</FieldLabel>
              <Input
                {...field}
                id="edit-rider-password"
                type="password"
                placeholder="Leave blank to keep current password"
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
                <FieldLabel htmlFor="edit-rider-dob">Date of Birth</FieldLabel>
                <DatePicker
                  id="edit-rider-dob"
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
                <FieldLabel htmlFor="edit-rider-phone">Contact Details</FieldLabel>
                <Input
                  {...field}
                  id="edit-rider-phone"
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
              <FieldLabel htmlFor="edit-rider-address">Residents Address</FieldLabel>
              <AddressCombobox
                id="edit-rider-address"
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
                existingImageUrl={existingFiles?.proofOfAddress}
                existingImageAlt="Proof of address"
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
        description="Update the rider's guarantor details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="guarantorFirstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-guarantor-first-name">First Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-guarantor-first-name"
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
                <FieldLabel htmlFor="edit-guarantor-last-name">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="edit-guarantor-last-name"
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
              <FieldLabel htmlFor="edit-guarantor-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="edit-guarantor-email"
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
              <FieldLabel htmlFor="edit-guarantor-phone">Telephone</FieldLabel>
              <Input
                {...field}
                id="edit-guarantor-phone"
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
              <FieldLabel htmlFor="edit-guarantor-relationship">Relationship</FieldLabel>
              <Input
                {...field}
                id="edit-guarantor-relationship"
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
              <FieldLabel htmlFor="edit-guarantor-address">Residents Address</FieldLabel>
              <AddressCombobox
                id="edit-guarantor-address"
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
                existingImageUrl={existingFiles?.guarantorProofOfAddress}
                existingImageAlt="Guarantor proof of address"
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
        description="Update the rider's identification documents."
      >
        <Controller
          name="nin"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="edit-rider-nin">NIN</FieldLabel>
              <Input
                {...field}
                id="edit-rider-nin"
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
                existingImageUrl={existingFiles?.driverLicense}
                existingImageAlt="Driver license"
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
        description="Update the rider's bank account information for payouts."
        className="pb-0"
      >
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="bankAccountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-bank-account-number">
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  id="edit-bank-account-number"
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
              <FieldLabel htmlFor="edit-bank-account-name">Account Name</FieldLabel>
              <Input
                {...field}
                id="edit-bank-account-name"
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
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
