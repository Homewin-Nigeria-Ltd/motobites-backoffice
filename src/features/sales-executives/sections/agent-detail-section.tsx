"use client"

import { useState } from "react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { Button } from "@/components/ui/button"
import { DashedProgress } from "@/components/ui/dashed-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Metric, PaceBadge, Panel, ProgressBar } from "../components/performance-ui"
import {
  useSalesExecutiveAgent,
  useUpdateSalesExecutiveStatus,
} from "../hooks/use-sales-performance"
import type { SalesExecutiveReferral } from "../types"
import { currentMonthKey, formatCount, monthName, shiftMonth } from "../utils/format"

const referralColumns: ColumnDef<SalesExecutiveReferral>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        {row.original.phone ? (
          <p className="text-xs text-muted-foreground">{row.original.phone}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "signedUp",
    header: "Signed up",
  },
  {
    accessorKey: "walletFunded",
    header: "Wallet funded",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (row.original.qualified ? "Qualified" : "Not qualified yet"),
  },
  {
    accessorKey: "earned",
    header: "Earned",
  },
]

export function SalesExecutiveAgentSection({ id }: { id: string }) {
  const [month, setMonth] = useState(currentMonthKey())
  const [page, setPage] = useState(1)
  const [confirming, setConfirming] = useState(false)
  const { data, isPending, isError } = useSalesExecutiveAgent(id, month, page)
  const updateStatus = useUpdateSalesExecutiveStatus()
  const suspended = data?.status === "suspended"
  const statusLabel =
    data?.status === "suspended"
      ? "Suspended"
      : data?.status === "active"
        ? "Active"
        : data?.status === "pending"
          ? "Pending"
          : (data?.status ?? "").replaceAll("_", " ")
  const months = [shiftMonth(currentMonthKey(), -1), currentMonthKey()]

  if (isPending) {
    return <AppLoader className="py-24" />
  }

  if (isError || !data) {
    return (
      <Panel>
        <p className="text-sm text-muted-foreground">Could not load this agent.</p>
      </Panel>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">{data.name}</h1>
          <p className="text-sm text-muted-foreground">
            <span
              className={
                suspended
                  ? "text-rose-700"
                  : data.status === "pending"
                    ? "text-amber-700"
                    : "text-emerald-700"
              }
            >
              {statusLabel}
            </span>
            {data.since ? ` · Agent since ${data.since}` : ""}
            {data.code ? ` · ${data.code}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-background p-1 shadow-sm">
            {months.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMonth(value)
                  setPage(1)
                }}
                className={
                  value === month
                    ? "rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
                    : "rounded-full px-3 py-1.5 text-sm text-muted-foreground"
                }
              >
                {monthName(value)}
              </button>
            ))}
          </div>
          <Button variant="outline" asChild>
            <Link href="/sales-executives/agents">Back to agents</Link>
          </Button>
          <Button
            variant={suspended ? "outline" : "destructive"}
            onClick={() => setConfirming(true)}
          >
            {suspended ? "Reinstate" : "Suspend"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Signed up"
          value={formatCount(data.signedUp)}
          note={data.since ? `Since ${data.since}` : undefined}
        />
        <Metric
          label="Qualified"
          value={formatCount(data.qualified)}
          note={
            data.signedUp
              ? `${formatCount(data.qualifiedPercent)}% of sign-ups`
              : undefined
          }
        />
        <Metric
          label={`Added to ${monthName(month)} pay`}
          value={data.periodPay}
          note={data.periodPayNote || undefined}
        />
        <Metric
          label="Earned in total"
          value={data.earnedTotal}
          note={data.earnedNote || undefined}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Panel className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {monthName(month)} target
            </p>
            {data.targetPace ? <PaceBadge pace={data.targetPace} /> : null}
          </div>
          <p className="text-3xl font-semibold">
            {formatCount(data.targetQualified)}
            <span className="text-lg text-muted-foreground">
              {" "}
              / {formatCount(data.targetGoal)}
            </span>
          </p>
          <DashedProgress value={data.targetQualified} max={data.targetGoal} fill />
          {data.targetNote ? (
            <p className="text-sm text-muted-foreground">{data.targetNote}</p>
          ) : null}
        </Panel>
        <Panel className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {data.raceGoal ? `Race to ${formatCount(data.raceGoal)}` : "Race"}
          </p>
          <p className="text-3xl font-semibold">
            {formatCount(data.raceQualified)}
            {data.raceGoal ? (
              <span className="text-lg text-muted-foreground">
                {" "}
                / {formatCount(data.raceGoal)}
              </span>
            ) : null}
          </p>
          {data.raceGoal ? (
            <ProgressBar
              value={data.raceQualified}
              max={data.raceGoal}
              className="h-3"
            />
          ) : null}
          {data.racePlace ? (
            <p className="text-sm text-muted-foreground">
              Rank {formatCount(data.racePlace)}
              {data.raceTotal ? ` of ${formatCount(data.raceTotal)}` : ""}
              {data.raceNote ? `. ${data.raceNote}` : ""}
            </p>
          ) : null}
          {data.raceLeaders.length ? (
            <ol className="flex flex-col gap-2">
              {data.raceLeaders.map((leader, index) => (
                <li
                  key={leader.id || `${leader.name}-${index}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span>
                    <span className="text-muted-foreground">{index + 1}. </span>
                    <span className={leader.id === data.id ? "font-medium" : undefined}>
                      {leader.name}
                    </span>
                  </span>
                  <span className="font-medium">{formatCount(leader.qualified)}</span>
                </li>
              ))}
            </ol>
          ) : null}
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_320px]">
        <DataTable
          columns={referralColumns}
          data={data.referrals}
          page={page}
          totalPages={Math.max(1, data.referralsLastPage)}
          onPageChange={setPage}
          emptyMessage="No signups in this month."
          tableClassName="min-w-[40rem]"
          toolbar={
            <h2 className="px-4 py-4 font-semibold">Users they brought in</h2>
          }
        />

        <div className="flex flex-col gap-3">
          <Panel>
            <h2 className="font-semibold">Profile</h2>
            <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              <dt className="text-muted-foreground">Promo code</dt>
              <dd>{data.promoCode}</dd>
              <dt className="text-muted-foreground">User ID</dt>
              <dd>{data.userId === "—" ? "-" : data.userId}</dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{data.phone}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all">{data.email}</dd>
              <dt className="text-muted-foreground">Paid through</dt>
              <dd>{data.paidThrough === "—" ? "-" : data.paidThrough}</dd>
            </dl>
          </Panel>
          <Panel>
            <h2 className="font-semibold">Activity</h2>
            {data.activity.length ? (
              <ul className="mt-3 flex flex-col gap-3 text-sm">
                {data.activity.map((item, index) => (
                  <li key={`${item.at}-${item.text}-${index}`}>
                    <p>{item.text}</p>
                    {item.note ? (
                      <p className="text-muted-foreground">{item.note}</p>
                    ) : null}
                    {item.at ? (
                      <p className="text-xs text-muted-foreground">{item.at}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No activity yet.</p>
            )}
          </Panel>
        </div>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {suspended ? `Reinstate ${data.name}?` : `Suspend ${data.name}?`}
            </DialogTitle>
            <DialogDescription>
              {suspended
                ? "They return to the active team and can receive targets again."
                : "They leave the active race, stop receiving new targets, and their sign-in sessions end."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button
              variant={suspended ? "default" : "destructive"}
              disabled={updateStatus.isPending}
              onClick={async () => {
                await updateStatus.mutateAsync({
                  id: data.id || Number(id),
                  status: suspended ? "active" : "suspended",
                })
                setConfirming(false)
              }}
            >
              {suspended ? "Reinstate" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
