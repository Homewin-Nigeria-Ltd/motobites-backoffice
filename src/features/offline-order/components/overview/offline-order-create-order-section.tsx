"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

export function OfflineOrderCreateOrderSection() {
  return (
    <Card className="gap-5 px-5 py-5 md:px-6 md:py-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Create Order</h2>
        <p className="text-sm text-muted-foreground">
          Choose the right order type before starting a new walk-in or bulk
          request.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icons.store size={18} />
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold text-foreground">Single Order</h3>
              <p className="text-sm text-muted-foreground">
                Normal walk-in or offline order for one customer.
              </p>
            </div>
          </div>
          <Button asChild className="mt-4 h-11 w-full">
            <Link href="/offline-order/new">Create Single Order</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icons.delivery size={18} />
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold text-foreground">Bulk Order</h3>
              <p className="text-sm text-muted-foreground">
                Corporate or group request with allocation quantities.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-4 h-11 w-full">
            <Link href="/offline-order/bulk">Create Bulk Order</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
