"use client"

import Link from "next/link"

import { AddRiderForm } from "../components/add-rider-form"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function AddRiderSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link href="/riders" aria-label="Back to riders">
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Add a New Rider
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete the form below to onboard a new delivery rider.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <AddRiderForm />
      </div>
    </div>
  )
}
