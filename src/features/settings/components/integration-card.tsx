"use client"

import Image from "next/image"
import Link from "next/link"

import type { ApiIntegration } from "@/features/settings/integration.types"
import { getIntegrationLogo } from "@/features/settings/utils/integration-logo"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type IntegrationCardProps = {
  integration: ApiIntegration
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const logoUrl = getIntegrationLogo(integration.provider, integration.logo_path)

  return (
    <Link
      href={`/settings/integration/${integration.provider}`}
      className="block h-full"
    >
      <Card
        className={cn(
          "h-full min-w-0 gap-0 overflow-hidden py-0 transition-shadow duration-200 hover:shadow-soft",
          "focus-visible:outline-none"
        )}
      >
        <div className="flex h-full min-w-0 flex-col px-5 py-5">
          <Image
            src={logoUrl}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0"
            aria-hidden
          />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {integration.name}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {integration.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}
