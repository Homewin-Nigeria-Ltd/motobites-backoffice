import { DataTable } from "@/components/data-table"
import { overviewStaffColumns } from "@/features/offline-order/columns/overview-staff-columns"
import type { OfflineOrderOverviewStaffRow } from "@/features/offline-order/types"

type OfflineOrderOverviewStaffCardProps = {
  staff: OfflineOrderOverviewStaffRow[]
}

export function OfflineOrderOverviewStaffCard({
  staff,
}: OfflineOrderOverviewStaffCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Top Sales Staff</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Staff performance and active POS ranking today.
        </p>
      </div>

      <DataTable
        columns={overviewStaffColumns}
        data={staff}
        emptyMessage="No staff performance data available yet."
        className="border-0 rounded-none"
        tableClassName="min-w-[40rem]"
      />
    </div>
  )
}
