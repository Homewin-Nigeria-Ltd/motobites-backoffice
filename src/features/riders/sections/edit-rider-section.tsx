"use client"

import Link from "next/link"
import { useMemo } from "react"

import { EditRiderForm } from "../components/edit-rider-form"
import { useRiderDetail } from "../hooks/use-rider-detail"
import {
  getRiderExistingFiles,
  mapRiderToFormValues,
} from "../utils/map-rider-to-form-values"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

type EditRiderSectionProps = {
  riderId: string
}

export function EditRiderSection({ riderId }: EditRiderSectionProps) {
  const { data: rider, isPending, isError } = useRiderDetail(riderId)

  const defaultValues = useMemo(
    () => (rider ? mapRiderToFormValues(rider) : undefined),
    [rider]
  )

  const existingFiles = useMemo(
    () => (rider ? getRiderExistingFiles(rider) : undefined),
    [rider]
  )

  if (isPending) {
    return <AppLoader className="flex-1 bg-muted p-12" />
  }

  if (isError || !rider || !defaultValues) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted p-6 text-sm text-destructive">
        Could not load rider details.
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" className="shrink-0" asChild>
          <Link href="/riders" aria-label="Back to riders">
            <Icons.chevronLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Edit Rider</h1>
          <p className="text-sm text-muted-foreground">
            Update {rider.name}&apos;s profile and delivery information.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
        <EditRiderForm
          riderId={rider.id}
          defaultValues={defaultValues}
          existingFiles={existingFiles}
        />
      </div>
    </div>
  )
}
