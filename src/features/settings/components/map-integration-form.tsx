"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { useUpdateIntegrationProvider } from "../hooks/use-update-integration-provider"
import type { ApiIntegrationProviderConfig } from "../integration.types"
import {
  getMapIntegrationDefaultValues,
  mapIntegrationSchema,
  type MapIntegrationFormValues,
} from "../schemas/map-integration.schema"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type MapIntegrationFormProps = {
  provider: ApiIntegrationProviderConfig
}

export function MapIntegrationForm({ provider }: MapIntegrationFormProps) {
  const { updateIntegrationProvider, isPending } = useUpdateIntegrationProvider()
  const defaultValues = getMapIntegrationDefaultValues(provider)

  const form = useForm<MapIntegrationFormValues>({
    resolver: zodResolver(mapIntegrationSchema),
    defaultValues,
  })

  function handleReset() {
    form.reset(defaultValues)
  }

  async function onSubmit(values: MapIntegrationFormValues) {
    await updateIntegrationProvider(provider.provider, {
      environment: provider.environment,
      is_enabled: provider.is_enabled,
      map_api_key_client: values.map_api_key_client,
      map_api_key_server: values.map_api_key_server,
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-12"
    >
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Google Map API Setup
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {provider.description}
        </p>
      </div>

      <div className="space-y-6">
        <FieldGroup className="gap-5">
          <Controller
            name="map_api_key_client"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="map-api-client-key">
                  Map Api Key (Client)
                </FieldLabel>
                <Input
                  {...field}
                  id="map-api-client-key"
                  placeholder="Map Api Key (Client)"
                  aria-invalid={fieldState.invalid}
                  className="h-11"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="map_api_key_server"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="map-api-server-key">
                  Map Api Key (Server)
                </FieldLabel>
                <Input
                  {...field}
                  id="map-api-server-key"
                  placeholder="Map Api Key (Server)"
                  aria-invalid={fieldState.invalid}
                  className="h-11"
                  disabled={isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-lg px-5"
            disabled={isPending}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="h-10 rounded-lg px-5"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  )
}
