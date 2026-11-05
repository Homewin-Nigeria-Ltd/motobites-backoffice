"use client"

import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useDebouncedSearch } from "@/features/restaurant/hooks/use-debounced-search"
import { cn } from "@/lib/utils"

import { Panel } from "../components/performance-ui"
import {
  useSalesExecutiveTargets,
  useSetSalesExecutiveTargets,
} from "../hooks/use-sales-performance"
import type { SalesExecutiveTargetRow } from "../types"
import { currentMonthKey, formatCount, monthName, shiftMonth } from "../utils/format"

type TargetDraft = {
  mode: "one" | "all" | "edit"
  agent?: SalesExecutiveTargetRow
}

export function SalesExecutiveTargetsSection() {
  const thisMonth = currentMonthKey()
  const lastMonth = shiftMonth(thisMonth, -1)
  const [month, setMonth] = useState(thisMonth)
  const [draft, setDraft] = useState<TargetDraft | null>(null)
  const search = useDebouncedSearch()
  const listKey = `${month}|${search.debouncedValue}`
  const [pageState, setPageState] = useState({ key: listKey, page: 1 })
  if (pageState.key !== listKey) {
    setPageState({ key: listKey, page: 1 })
  }
  const page = pageState.page
  const setPage = (next: number) => {
    setPageState({ key: listKey, page: next })
  }
  const { data, isPending, isError } = useSalesExecutiveTargets(
    month,
    search.debouncedValue
  )
  const saveTarget = useSetSalesExecutiveTargets()
  const previous = shiftMonth(month, -1)
  const rows = useMemo(
    () => (isError ? [] : (data?.agents ?? [])),
    [isError, data?.agents]
  )
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage]
  )
  const columns = useMemo<ColumnDef<SalesExecutiveTargetRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Agent",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            {row.original.code ? (
              <p className="text-xs text-muted-foreground">{row.original.code}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: "previous",
        header: monthName(previous),
        cell: ({ row }) =>
          row.original.previousTarget
            ? `${formatCount(row.original.previousQualified)} of ${formatCount(row.original.previousTarget)}`
            : row.original.previousQualified
              ? formatCount(row.original.previousQualified)
              : "No target",
      },
      {
        id: "target",
        header: `${monthName(month)} target`,
        cell: ({ row }) =>
          Number.isFinite(row.original.target)
            ? formatCount(row.original.target)
            : "Not set",
      },
      {
        id: "setBy",
        header: "Set by",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.setBy
              ? `${row.original.setBy}${row.original.setAt ? `, ${row.original.setAt}` : ""}`
              : "—"}
          </span>
        ),
      },
      {
        id: "action",
        header: "",
        cell: ({ row }) => {
          const hasTarget = Number.isFinite(row.original.target)
          return (
            <div className="text-right">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setDraft({
                    mode: hasTarget ? "edit" : "one",
                    agent: row.original,
                  })
                }
              >
                {hasTarget ? "Edit" : "Set"}
              </Button>
            </div>
          )
        },
      },
    ],
    [month, previous, setDraft]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Targets</h1>
          <p className="text-sm text-muted-foreground">
            {data?.monthLabel || `${monthName(month)} ${month.slice(0, 4)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full bg-background p-1 shadow-sm">
            {[lastMonth, thisMonth].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMonth(value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  value === month
                    ? "bg-secondary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {monthName(value)}
              </button>
            ))}
          </div>
          <Button type="button" onClick={() => setDraft({ mode: "one" })}>
            Set a target
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_280px]">
        <DataTable
          columns={columns}
          data={pageRows}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isPending}
          emptyMessage={isError ? "Could not load targets." : "No agents for this month."}
          toolbar={
            <div className="flex justify-end border-b border-border px-4 py-4">
              <Input
                value={search.value}
                onChange={(event) => search.setValue(event.target.value)}
                placeholder="Find an agent"
                icon={{ name: "search", position: "left" }}
                className="w-64 bg-background"
              />
            </div>
          }
        />

        <Panel className="h-fit">
          <h2 className="font-semibold">How targets work</h2>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground">
            <li>Set a target for one agent, or give every agent the same target.</li>
            <li>Edit a target any time. The agent gets a text with the new number.</li>
            <li>Agents see their target on their dashboard from the 1st of the month.</li>
          </ul>
        </Panel>
      </div>

      {draft ? (
        <TargetDialog
          key={`${draft.mode}-${draft.agent?.id ?? "new"}`}
          draft={draft}
          month={month}
          agents={data?.agents ?? []}
          average={data?.firstMonthAverage}
          pending={saveTarget.isPending}
          onClose={() => setDraft(null)}
          onSave={async (input) => {
            await saveTarget.mutateAsync(input)
            setDraft(null)
          }}
        />
      ) : null}
    </div>
  )
}

function TargetDialog({
  draft,
  month,
  agents,
  average,
  pending,
  onClose,
  onSave,
}: {
  draft: TargetDraft
  month: string
  agents: SalesExecutiveTargetRow[]
  average?: number
  pending: boolean
  onClose: () => void
  onSave: (input: {
    month: string
    target: number
    agent_id?: number
    all_agents?: boolean
    note?: string
  }) => Promise<unknown>
}) {
  const editing = draft.mode === "edit"
  const [mode, setMode] = useState<"one" | "all">(
    draft.mode === "all" ? "all" : "one"
  )
  const [agentId, setAgentId] = useState(
    draft.agent ? String(draft.agent.id) : ""
  )
  const [target, setTarget] = useState(
    editing && draft.agent ? String(draft.agent.target) : ""
  )
  const [note, setNote] = useState("")
  const activeMode = mode
  const selectedAgent = draft.agent
  const chosenId = selectedAgent ? selectedAgent.id : Number(agentId)

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing && selectedAgent
              ? `Edit ${selectedAgent.name}'s ${monthName(month)} target`
              : "Set a target"}
          </DialogTitle>
          <DialogDescription>
            {editing && selectedAgent
              ? `Now ${formatCount(selectedAgent.target)} qualified users.${selectedAgent.setAt ? ` You set it on ${selectedAgent.setAt}.` : ""}`
              : `Agents see it on their dashboard from 1 ${monthName(month)}.`}
          </DialogDescription>
        </DialogHeader>

        {!editing ? (
          <div className="inline-flex w-fit rounded-full bg-muted p-1">
            {(["one", "all"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  activeMode === value && "bg-background font-medium shadow-sm"
                )}
              >
                {value === "one" ? "One agent" : "All agents"}
              </button>
            ))}
          </div>
        ) : null}

        {!editing && selectedAgent && activeMode === "one" ? (
          <p className="text-sm font-medium">{selectedAgent.name}</p>
        ) : null}

        {!editing && activeMode === "one" && !selectedAgent ? (
          <Select value={agentId || undefined} onValueChange={setAgentId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={String(agent.id)}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <label className="flex flex-col gap-1.5 text-sm">
          <span>{editing ? "New target" : `Qualified users in ${monthName(month)}`}</span>
          <Input
            type="number"
            min={1}
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          />
          {!editing && Number.isFinite(average) ? (
            <span className="text-xs text-muted-foreground">
              New agents average {formatCount(average ?? 0)} qualified users in
              their first month.
            </span>
          ) : null}
          {editing && selectedAgent?.previousQualified ? (
            <span className="text-xs text-muted-foreground">
              {monthName(shiftMonth(month, -1))}:{" "}
              {formatCount(selectedAgent.previousQualified)} qualified.
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span>Note to the agent, optional</span>
          <Textarea
            value={note}
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            They get a text with the new number. The change is saved in their
            dashboard.
          </span>
        </label>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={pending || Number(target) < 1 || (activeMode === "one" && !chosenId)}
            onClick={() =>
              onSave({
                month,
                target: Number(target),
                ...(activeMode === "all"
                  ? { all_agents: true }
                  : { agent_id: chosenId }),
                ...(note.trim() ? { note: note.trim() } : {}),
              })
            }
          >
            {editing ? "Save change" : "Save target"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
