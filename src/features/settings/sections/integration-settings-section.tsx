"use client"

import { useState } from "react"

import { IntegrationCard } from "../components/integration-card"
import { IntegrationCategoryTabs } from "../components/integration-category-tabs"
import { useIntegrations } from "../hooks/use-integrations"
import type { IntegrationCategory } from "../integration.types"
import { AppLoader } from "@/components/ui/app-loader"

const categoryErrorMessages: Record<IntegrationCategory, string> = {
  payment: "Could not load payment integrations.",
  map: "Could not load map integrations.",
  recovery: "Could not load recovery integrations.",
}

export function IntegrationSettingsSection() {
  const [category, setCategory] = useState<IntegrationCategory>("payment")

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <div className="space-y-8">
          <IntegrationCategoryTabs value={category} onChange={setCategory} />
          <IntegrationsList category={category} />
        </div>
      </div>
    </div>
  )
}

function IntegrationsList({ category }: { category: IntegrationCategory }) {
  const { data: integrations, isPending, isError } = useIntegrations(category)

  if (isPending) {
    return <AppLoader className="py-12" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-destructive">
        {categoryErrorMessages[category]}
      </div>
    )
  }

  if (!integrations?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        No integrations found for this category.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.provider} integration={integration} />
      ))}
    </div>
  )
}
