"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

type BackLinkProps = {
  href: string
  label: string
  className?: string
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn("shrink-0", className)}
      asChild
    >
      <Link href={href} aria-label={`Back to ${label}`}>
        <Icons.chevronLeft size={20} />
      </Link>
    </Button>
  )
}
