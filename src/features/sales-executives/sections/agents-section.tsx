"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"
import { cn } from "@/lib/utils"

import {
  PaceBadge,
  periodRange,
  SalesPeriodControl,
  TargetFraction,
} from "../components/performance-ui"
import { useSalesExecutiveAgents } from "../hooks/use-sales-performance"
import type {
  SalesExecutiveAgent,
  SalesExecutiveAgentFilter,
  SalesExecutivePeriod,
} from "../types"
import { currentMonthKey, formatCount, monthName, shiftMonth } from "../utils/format"

const filters: { value: SalesExecutiveAgentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "behind_pace", label: "Behind pace" },
  { value: "new_this_week", label: "New this week" },
  { value: "no_signups_7_days", label: "No signups in 7 days" },
  { value: "suspended", label: "Suspended" },
]

function downloadAgents(agents: SalesExecutiveAgent[]) {
  const header = [
    "Agent",
    "Code",
    "Joined",
    "Signed up",
    "Qualified",
    "Target",
    "Last signup",
    "Pace",
  ]
  const rows = agents.map((agent) => [
    agent.name,
    agent.code,
    agent.joinedAt,
    agent.signedUp,
    agent.qualified,
    agent.target,
    agent.lastSignup,
    agent.pace,
  ])
  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "sales-agents.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function agentColumns(month: string): ColumnDef<SalesExecutiveAgent>[] {
  return [
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
      accessorKey: "joinedAt",
      header: "Joined",
    },
    {
      accessorKey: "signedUp",
      header: "Signed up",
      cell: ({ row }) => formatCount(row.original.signedUp),
    },
    {
      accessorKey: "qualified",
      header: "Qualified",
      cell: ({ row }) => formatCount(row.original.qualified),
    },
    {
      id: "target",
      header: `${month} target`,
      cell: ({ row }) => (
        <TargetFraction
          qualified={row.original.qualified}
          target={row.original.target}
        />
      ),
    },
    {
      accessorKey: "lastSignup",
      header: "Last signup",
    },
    {
      accessorKey: "pace",
      header: "Pace",
      cell: ({ row }) => <PaceBadge pace={row.original.pace} />,
    },
  ]
}

export function SalesExecutiveAgentsSection() {
  const router = useRouter()
  const [period, setPeriod] = useState<SalesExecutivePeriod>("this_month")
  const [range, setRange] = useState<DateRange>()
  const [filter, setFilter] = useState<SalesExecutiveAgentFilter>("all")
  const search = useDebouncedSearch()
  const { from, to } = periodRange(range)
  const listKey = `${filter}|${period}|${from ?? ""}|${to ?? ""}|${search.debouncedValue}`
  const [pageState, setPageState] = useState({ key: listKey, page: 1 })
  if (pageState.key !== listKey) {
    setPageState({ key: listKey, page: 1 })
  }
  const page = pageState.page
  const setPage = (next: number) => {
    setPageState({ key: listKey, page: next })
  }
  const { data, isLoading, isError } = useSalesExecutiveAgents(
    period,
    filter,
    search.debouncedValue,
    from,
    to
  )
  const month =
    period === "last_month"
      ? monthName(shiftMonth(currentMonthKey(), -1))
      : monthName(currentMonthKey())
  const waitingForDates = period === "custom" && (!from || !to)
  const rows = useMemo(
    () => (waitingForDates || isError ? [] : (data?.items ?? [])),
    [waitingForDates, isError, data?.items]
  )
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage]
  )
  const columns = useMemo(() => agentColumns(month), [month])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Agents</h1>
        </div>
        <SalesPeriodControl
          period={period}
          onPeriodChange={setPeriod}
          range={range}
          onRangeChange={setRange}
        />
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(agent) => router.push(`/sales-executives/agents/${agent.id}`)}
        isLoading={!waitingForDates && isLoading}
        emptyMessage={
          waitingForDates
            ? "Choose a start and end date."
            : isError
              ? "Could not load agents."
              : "No agents match this filter."
        }
        toolbar={
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm",
                    filter === item.value
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  {Number.isFinite(data?.counts[item.value])
                    ? ` ${formatCount(data?.counts[item.value] ?? 0)}`
                    : ""}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-64 shrink-0">
                <Input
                  value={search.value}
                  onChange={(event) => search.setValue(event.target.value)}
                  placeholder="Name, code or user ID"
                  icon={{ name: "search", position: "left" }}
                  className="bg-background"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                icon={{ name: "download", position: "left" }}
                onClick={() => downloadAgents(data?.items ?? [])}
                disabled={!data?.items?.length}
              >
                Export CSV
              </Button>
            </div>
          </div>
        }
      />
    </div>
  )
}
