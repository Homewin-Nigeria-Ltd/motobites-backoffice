"use client"

import * as React from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateIntegrationProvider } from "../hooks/use-update-integration-provider"
import type { ApiIntegrationProviderConfig } from "../integration.types"
import {
  INTEGRATION_ENVIRONMENT_LABELS,
  type IntegrationEnvironment,
} from "../integration.types"
import {
  createRecoveryIntegrationSchema,
  getRecoveryIntegrationDefaultValues,
  type RecoveryIntegrationFormValues,
} from "../schemas/recovery-integration.schema"
import { getIntegrationLogo } from "../utils/integration-logo"
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type EnvironmentOption = {
  value: IntegrationEnvironment
  label: string
}

const environmentOptions: EnvironmentOption[] = (
  Object.keys(INTEGRATION_ENVIRONMENT_LABELS) as IntegrationEnvironment[]
).map((value) => ({
  value,
  label: INTEGRATION_ENVIRONMENT_LABELS[value],
}))

type RecoveryIntegrationFormProps = {
  provider: ApiIntegrationProviderConfig
}

function RecoveryLogoField({
  file,
  existingFileName,
  onChange,
  disabled,
}: {
  file: File | null
  existingFileName: string | null
  onChange: (file: File | null) => void
  disabled?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const displayName = file?.name ?? existingFileName

  return (
    <Field>
      <FieldLabel htmlFor="recovery-integration-logo">Choose logo</FieldLabel>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-sm border border-border bg-input/50 px-1",
          disabled && "opacity-70"
        )}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-8 shrink-0 rounded-md px-3 text-xs"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose logo
        </Button>
        <span className="min-w-0 truncate px-1 text-sm text-muted-foreground">
          {displayName ?? "Choose logo"}
        </span>
        <input
          ref={inputRef}
          id="recovery-integration-logo"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null)
          }}
        />
      </div>
    </Field>
  )
}

function getExistingLogoName(logo_path: string | null) {
  if (!logo_path) return null
  return logo_path.split("/").pop() ?? null
}

export function RecoveryIntegrationForm({ provider }: RecoveryIntegrationFormProps) {
  const { updateIntegrationProvider, isPending } = useUpdateIntegrationProvider()

  const form = useForm<RecoveryIntegrationFormValues>({
    resolver: zodResolver(createRecoveryIntegrationSchema(provider.has_secret_key)),
    defaultValues: getRecoveryIntegrationDefaultValues(provider),
  })

  const logoUrl = getIntegrationLogo(provider.provider, provider.logo_path)
  const secretKeyPlaceholder =
    provider.has_secret_key && provider.secret_key_masked
      ? provider.secret_key_masked
      : "Secret key"

  async function onSubmit(values: RecoveryIntegrationFormValues) {
    await updateIntegrationProvider(provider.provider, {
      environment: values.environment,
      is_enabled: provider.is_enabled,
      payment_gateway_title: values.payment_gateway_title,
      public_key: values.public_key,
      hash: values.hash,
      ...(values.secret_key ? { secret_key: values.secret_key } : {}),
      logo: values.logo,
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12"
    >
      <div className="space-y-5">
        <Image
          src={logoUrl}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
          aria-hidden
        />
        <div>
          <h1 className="text-sm font-semibold text-foreground">{provider.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {provider.description}
          </p>
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="h-10 rounded-lg px-5"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <FieldGroup className="gap-5">
        <Controller
          name="environment"
          control={form.control}
          render={({ field, fieldState }) => {
            const selectedEnvironment =
              environmentOptions.find((option) => option.value === field.value) ??
              null

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Environment</FieldLabel>
                <Combobox
                  items={environmentOptions}
                  value={selectedEnvironment}
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
                    placeholder="Select environment"
                    showClear={false}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No environment found.</ComboboxEmpty>
                    <ComboboxList>
                      <ComboboxCollection>
                        {(option: EnvironmentOption) => (
                          <ComboboxItem key={option.value} value={option}>
                            {option.label}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />

        <Controller
          name="secret_key"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recovery-secret-key">
                Secret key{" "}
                {!provider.has_secret_key ? (
                  <span className="text-destructive">*</span>
                ) : null}
              </FieldLabel>
              <Input
                {...field}
                id="recovery-secret-key"
                type="password"
                placeholder={secretKeyPlaceholder}
                aria-invalid={fieldState.invalid}
                className="h-11"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="public_key"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recovery-public-key">
                Public key <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="recovery-public-key"
                placeholder="Public key"
                aria-invalid={fieldState.invalid}
                className="h-11"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hash"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recovery-hash">
                Hash <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="recovery-hash"
                placeholder="Hash"
                aria-invalid={fieldState.invalid}
                className="h-11 bg-muted"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="payment_gateway_title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="recovery-gateway-title">
                Payment gateway title
              </FieldLabel>
              <Input
                {...field}
                id="recovery-gateway-title"
                placeholder="Payment gateway title"
                aria-invalid={fieldState.invalid}
                className="h-11"
                disabled={isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="logo"
          control={form.control}
          render={({ field }) => (
            <RecoveryLogoField
              file={field.value}
              existingFileName={getExistingLogoName(provider.logo_path)}
              onChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
      </FieldGroup>
    </form>
  )
}
