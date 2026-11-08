"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

import { DataTable } from "@/components/data-table/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { DashedProgress } from "@/components/ui/dashed-progress"
import { cn } from "@/lib/utils"

import {
  Metric,
  Panel,
  periodRange,
  ProgressBar,
  SalesPeriodControl,
  TargetFraction,
  PaceBadge,
} from "../components/performance-ui"
import { useSalesExecutiveOverview } from "../hooks/use-sales-performance"
import type {
  SalesExecutiveAgent,
  SalesExecutiveAlert,
  SalesExecutivePeriod,
} from "../types"
import { currentMonthKey, formatCount, formatPercent, monthName, shiftMonth } from "../utils/format"

function alertTone(tone: string) {
  if (tone === "warning" || tone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-900"
  }

  if (tone === "info" || tone === "blue") {
    return "border-sky-200 bg-sky-50 text-sky-900"
  }

  return "border-border bg-muted text-foreground"
}

function AlertCard({ alert }: { alert: SalesExecutiveAlert }) {
  return (
    <div className={cn("rounded-xl border px-3 py-2.5", alertTone(alert.tone))}>
      <p className="text-sm font-medium">{alert.title}</p>
      {alert.body ? <p className="mt-0.5 text-sm opacity-80">{alert.body}</p> : null}
    </div>
  )
}

const overviewAgentColumns: ColumnDef<SalesExecutiveAgent>[] = [
  {
    accessorKey: "name",
    header: "Agent",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        {row.original.code ? (
          <p className="text-xs text-muted-foreground">{row.original.code}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "qualified",
    header: "Qualified",
    cell: ({ row }) => formatCount(row.original.qualified),
  },
  {
    id: "target",
    header: "Against target",
    cell: ({ row }) => (
      <TargetFraction
        qualified={row.original.qualified}
        target={row.original.target}
      />
    ),
  },
  {
    accessorKey: "pace",
    header: "Pace",
    cell: ({ row }) => <PaceBadge pace={row.original.pace} />,
  },
]

export function SalesExecutiveOverviewSection() {
  const router = useRouter()
  const [period, setPeriod] = useState<SalesExecutivePeriod>("this_month")
  const [range, setRange] = useState<DateRange>()
  const [page, setPage] = useState(1)
  const { from, to } = periodRange(range)
  const { data, isLoading, isError } = useSalesExecutiveOverview(period, from, to)
  const month =
    period === "last_month"
      ? monthName(shiftMonth(currentMonthKey(), -1))
      : monthName(currentMonthKey())
  const agents = useMemo(() => data?.agents ?? [], [data?.agents])
  const pageSize = 10
  const agentPages = Math.max(1, Math.ceil(agents.length / pageSize))
  const agentPage = Math.min(page, agentPages)
  const agentRows = useMemo(
    () => agents.slice((agentPage - 1) * pageSize, agentPage * pageSize),
    [agents, agentPage]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SalesPeriodControl
          period={period}
          onPeriodChange={(next) => {
            setPeriod(next)
            setPage(1)
          }}
          range={range}
          onRangeChange={setRange}
        />
        {data?.campaignNote ? (
          <p className="text-sm text-muted-foreground">{data.campaignNote}</p>
        ) : null}
      </div>

      {period === "custom" && (!from || !to) ? (
        <Panel>
          <p className="text-sm text-muted-foreground">Choose a start and end date.</p>
        </Panel>
      ) : null}
      {isLoading ? <AppLoader className="py-24" /> : null}
      {isError ? (
        <Panel>
          <p className="text-sm text-muted-foreground">Could not load the sales overview.</p>
        </Panel>
      ) : null}

      {data ? (
      <>
      <div>
            <h1 className="text-lg font-semibold">
              {data.title || `All agents, ${month}`}
            </h1>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Qualified users"
              value={formatCount(data.qualifiedUsers)}
              note={
                Number.isFinite(data.qualifiedChangePercent)
                  ? `${formatPercent(data.qualifiedChangePercent)}${data.qualifiedComparison ? ` ${data.qualifiedComparison}` : ""}`
                  : undefined
              }
              accent="text-emerald-700"
            />
            <Metric
              label="Signed up"
              value={formatCount(data.signedUp)}
              note={
                data.notQualified
                  ? `${formatCount(data.notQualified)} not qualified yet`
                  : undefined
              }
            />
            <Metric
              label="Active agents"
              value={formatCount(data.activeAgents)}
              note={
                data.joinedThisWeek
                  ? `${formatCount(data.joinedThisWeek)} joined this week`
                  : undefined
              }
              accent="text-emerald-700"
            />
            <Metric
              label={`Added to ${month} pay`}
              value={data.periodPayLabel}
              note={data.payNote || undefined}
            />
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
            <Panel className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {data.targetLabel || `${month} target, all agents`}
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {formatCount(data.targetQualified)}
                    <span className="text-lg font-medium text-muted-foreground">
                      {" "}
                      / {formatCount(data.targetGoal)}
                    </span>
                  </p>
                </div>
                {data.targetProjected ? (
                  <p className="text-sm text-primary">
                    On pace for {formatCount(data.targetProjected)}
                  </p>
                ) : null}
              </div>
              <DashedProgress
                value={data.targetQualified}
                max={data.targetGoal}
                fill
              />
              <p className="text-sm text-muted-foreground">
                {data.targetGoal > 0
                  ? `${formatCount(data.targetRemaining)} to go.${
                      data.targetProjected
                        ? ` At the current pace agents end ${month} on ${formatCount(data.targetProjected)}.`
                        : ""
                    }`
                  : `No target set for ${month}.`}
              </p>
            </Panel>

            <Panel className="flex flex-col gap-3">
              <h2 className="font-semibold">Watch these</h2>
              {data.alerts.length ? (
                data.alerts.map((alert) => (
                  <AlertCard key={alert.key} alert={alert} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nothing to watch right now.
                </p>
              )}
            </Panel>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
            <DataTable
              columns={overviewAgentColumns}
              data={agentRows}
              page={agentPage}
              totalPages={agentPages}
              onPageChange={setPage}
              onRowClick={(agent) => router.push(`/sales-executives/agents/${agent.id}`)}
              emptyMessage="No agents in this period."
              tableClassName="min-w-[40rem]"
              toolbar={
                <div className="flex items-center justify-between px-4 py-4">
                  <h2 className="font-semibold">Agents this month</h2>
                  <Link
                    href="/sales-executives/agents"
                    className="text-sm font-medium text-primary"
                  >
                    See all agents
                  </Link>
                </div>
              }
            />

            <Panel>
              <h2 className="font-semibold">Race to 100</h2>
              <ol className="mt-4 flex flex-col gap-4">
                {(data.race.length ? data.race : data.agents)
                  .slice(0, 5)
                  .map((agent, index) => (
                    <li key={agent.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                      <span className="text-sm text-muted-foreground">{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <ProgressBar
                          value={agent.qualified}
                          max={100}
                          className="mt-1"
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {formatCount(agent.qualified)}
                      </span>
                    </li>
                  ))}
              </ol>
            </Panel>
          </div>
      </>
      ) : null}
    </div>
  )
}
