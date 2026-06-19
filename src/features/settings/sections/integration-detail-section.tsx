"use client"

import Link from "next/link"
import type { ReactNode } from "react"

import { MapIntegrationForm } from "../components/map-integration-form"
import { PaymentIntegrationForm } from "../components/payment-integration-form"
import { RecoveryIntegrationForm } from "../components/recovery-integration-form"
import { useIntegrationProvider } from "../hooks/use-integrations"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type IntegrationDetailSectionProps = {
  integrationId: string
}

function IntegrationBackButton() {
  return (
    <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
      <Link href="/settings/integration" aria-label="Back to integrations">
        <Icons.chevronLeft size={20} />
      </Link>
    </Button>
  )
}

function IntegrationDetailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4">
        <IntegrationBackButton />
      </div>
      {children}
    </div>
  )
}

export function IntegrationDetailSection({
  integrationId,
}: IntegrationDetailSectionProps) {
  const {
    data: provider,
    isPending,
    isError,
  } = useIntegrationProvider(integrationId)

  if (isPending) {
    return (
      <IntegrationDetailLayout>
        <AppLoader className="flex-1 p-12" />
      </IntegrationDetailLayout>
    )
  }

  if (isError) {
    return (
      <IntegrationDetailLayout>
        <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-destructive">
          Could not load integration.
        </div>
      </IntegrationDetailLayout>
    )
  }

  if (!provider) {
    return (
      <IntegrationDetailLayout>
        <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-destructive">
          Integration not found.
        </div>
      </IntegrationDetailLayout>
    )
  }

  return (
    <IntegrationDetailLayout>
      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        {provider.category === "map" ? (
          <MapIntegrationForm
            key={`${provider.provider}-${provider.environment}`}
            provider={provider}
          />
        ) : provider.category === "recovery" ? (
          <RecoveryIntegrationForm
            key={`${provider.provider}-${provider.environment}`}
            provider={provider}
          />
        ) : (
          <PaymentIntegrationForm
            key={`${provider.provider}-${provider.environment}`}
            provider={provider}
          />
        )}
      </div>
    </IntegrationDetailLayout>
  )
}
