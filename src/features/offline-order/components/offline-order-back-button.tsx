"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"

type OfflineOrderBackButtonProps = {
  href: string
  label: string
}

export function OfflineOrderBackButton({
  href,
  label,
}: OfflineOrderBackButtonProps) {
  return (
    <div className="border-b border-border/50 bg-background px-4 py-3 md:px-6">
      <Button
        asChild
        variant="ghost"
        className="h-9 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={href}>
          <Icon name="chevronLeft" size={18} />
          {label}
        </Link>
      </Button>
    </div>
  )
}
