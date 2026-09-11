import { Skeleton } from "@/components/ui/skeleton"

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-9 w-16" />
    </div>
  )
}

export function OverviewStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function OverviewOrderListSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function OverviewStaffSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <Skeleton className="mb-2 h-5 w-36" />
      <Skeleton className="mb-4 h-4 w-56" />
      <Skeleton className="h-52 w-full rounded-xl" />
    </div>
  )
}

export function OverviewActivitySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <Skeleton className="mb-2 h-5 w-32" />
      <Skeleton className="mb-4 h-4 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function OverviewTransactionsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <Skeleton className="mb-4 h-5 w-44" />
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  )
}

export function OverviewOperationalReportsSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <Skeleton className="mb-2 h-5 w-44" />
      <Skeleton className="mb-5 h-4 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
