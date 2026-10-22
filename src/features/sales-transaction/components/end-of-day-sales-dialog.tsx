"use client"

import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"

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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ASSETS } from "@/constants/assets"
import { useBranchFilter } from "@/context/branch-context"
import "@/features/offline-order/components/offline-order-pos-receipt.css"
import { salesTransactionEndpoints } from "@/features/sales-transaction/api/endpoints"
import { staffQueries } from "@/features/staff/api/queries"
import { api } from "@/lib/api/client"
import { toast } from "@/lib/toast"

const ALL = "all"

type EndOfDayFilters = {
  date: string
  salesRepId: string
  fulfillmentBranchId: string
  branchId: string
}

type EndOfDayReportData = {
  rows: Record<string, unknown>[]
  total: number
}

type ReceiptPerson = {
  name: string
  role: string
  email: string
  branch: string
  address: string
  status: string
  joined: string
}

function todayInputValue() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readReport(payload: unknown): EndOfDayReportData {
  const body = isRecord(payload) ? payload : {}
  const data = Array.isArray(body.data)
    ? body.data
    : Array.isArray(payload)
      ? payload
      : []
  const rows = data.filter(isRecord)
  const total =
    isRecord(body.meta) && typeof body.meta.total === "number"
      ? body.meta.total
      : rows.length

  return { rows, total }
}

function text(value: unknown, fallback = "—") {
  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return fallback
}

function toReceiptPerson(row: Record<string, unknown>): ReceiptPerson {
  const branch = isRecord(row.fulfillment_branch) ? row.fulfillment_branch : null

  return {
    name: text(row.full_name ?? row.name),
    role: text(row.role_label ?? row.staff_role),
    email: text(row.email),
    branch: branch ? text(branch.name, "No branch") : "No branch",
    address: branch ? text(branch.address, "") : "",
    status: text(row.status_label ?? row.status),
    joined: text(row.joined_at),
  }
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null
  }

  return (
    <div className="receipt-detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}

function EndOfDayReceipt({
  date,
  salesRep,
  fulfillmentBranch,
  branch,
  report,
}: {
  date: string
  salesRep: string
  fulfillmentBranch: string
  branch: string
  report: EndOfDayReportData
}) {
  const people = report.rows.map(toReceiptPerson)

  return (
    <div className="pos-receipt mx-auto w-full max-w-[80mm] bg-white font-mono text-[20px] leading-[1.4] text-black print:text-[20px]">
      <div className="border border-black/15 p-4 print:border-0 print:p-0">
        <div className="text-center">
          <img
            src={ASSETS.brand.logo}
            alt="Motobites"
            width={240}
            height={240}
            className="receipt-logo"
          />
        </div>

        <div className="my-3 border-t border-dashed border-black/50" />

        <ReceiptLine label="Date" value={date} />
        <ReceiptLine label="Sales rep" value={salesRep} />
        <ReceiptLine label="Fulfillment" value={fulfillmentBranch} />
        <ReceiptLine label="Branch" value={branch} />
        <ReceiptLine label="Total" value={String(report.total)} />

        <div className="my-3 border-t border-dashed border-black/50" />

        {people.length === 0 ? (
          <p className="text-center">No records</p>
        ) : (
          people.map((person, index) => (
            <div key={`${person.email}-${index}`} className="mb-3">
              <p className="font-bold">{person.name}</p>
              <ReceiptLine label="Role" value={person.role} />
              <ReceiptLine label="Email" value={person.email} />
              <ReceiptLine label="Branch" value={person.branch} />
              <ReceiptLine label="Address" value={person.address} />
              <ReceiptLine label="Status" value={person.status} />
              <ReceiptLine label="Joined" value={person.joined} />
              {index < people.length - 1 ? (
                <div className="mt-3 border-t border-dashed border-black/30" />
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function EndOfDaySalesButton() {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<EndOfDayFilters>({
    date: todayInputValue(),
    salesRepId: ALL,
    fulfillmentBranchId: ALL,
    branchId: ALL,
  })
  const [report, setReport] = useState<EndOfDayReportData | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const shouldPrint = useRef(false)
  const { activeBranches } = useBranchFilter()
  const { data: staff } = useQuery({
    ...staffQueries.list({ page: 1, per_page: 100 }),
    enabled: open,
  })

  useEffect(() => {
    if (!shouldPrint.current || report == null) {
      return
    }

    shouldPrint.current = false
    window.print()
  }, [report])

  const updateFilter = (key: keyof EndOfDayFilters, value: string) => {
    setReport(null)
    setFilters((current) => ({ ...current, [key]: value }))
  }

  const salesRepName =
    filters.salesRepId === ALL
      ? "All"
      : (staff?.items.find((member) => String(member.userId) === filters.salesRepId)
          ?.name ?? filters.salesRepId)

  const branchName = (id: string) => {
    if (id === ALL) {
      return "All"
    }

    return activeBranches.find((branch) => branch.id === id)?.name ?? id
  }

  const handlePrint = async () => {
    if (!filters.date) {
      toast.error("Choose a date.")
      return
    }

    const params: Record<string, string | number> = { date: filters.date }

    if (filters.salesRepId !== ALL) {
      params.sales_rep_id = Number(filters.salesRepId)
    }

    if (filters.fulfillmentBranchId !== ALL) {
      params.fulfillment_branch_id = Number(filters.fulfillmentBranchId)
    }

    if (filters.branchId !== ALL) {
      params.branch_id = Number(filters.branchId)
    }

    try {
      setIsPrinting(true)
      const response = await api.get<unknown>(
        salesTransactionEndpoints.endOfDaySales,
        params,
      )
      shouldPrint.current = true
      setReport(readReport(response))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load end of day sales."
      toast.error(message)
    } finally {
      setIsPrinting(false)
    }
  }

  const receiptProps = report
    ? {
        date: filters.date,
        salesRep: salesRepName,
        fulfillmentBranch: branchName(filters.fulfillmentBranchId),
        branch: branchName(filters.branchId),
        report,
      }
    : null

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        End of day
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="no-print max-h-[85vh] w-[min(40rem,calc(100%-2rem))] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>End of day sales</DialogTitle>
            <DialogDescription>
              Choose a date and filters, then print the report.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eod-date">Date</Label>
              <Input
                id="eod-date"
                type="date"
                value={filters.date}
                onChange={(event) => updateFilter("date", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sales rep</Label>
              <Select
                value={filters.salesRepId}
                onValueChange={(value) => updateFilter("salesRepId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All sales reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All sales reps</SelectItem>
                  {(staff?.items ?? []).map((member) => (
                    <SelectItem key={member.userId} value={String(member.userId)}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fulfillment branch</Label>
              <Select
                value={filters.fulfillmentBranchId}
                onValueChange={(value) => updateFilter("fulfillmentBranchId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All branches</SelectItem>
                  {activeBranches.map((branch) => (
                    <SelectItem key={`fulfillment-${branch.id}`} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={filters.branchId}
                onValueChange={(value) => updateFilter("branchId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All branches</SelectItem>
                  {activeBranches.map((branch) => (
                    <SelectItem key={`branch-${branch.id}`} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {receiptProps ? <EndOfDayReceipt {...receiptProps} /> : null}

          <DialogFooter>
            <Button type="button" onClick={() => void handlePrint()} disabled={isPrinting}>
              {isPrinting ? "Loading..." : "Print"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {receiptProps ? (
        <div className="pos-receipt-print-root">
          <EndOfDayReceipt {...receiptProps} />
        </div>
      ) : null}
    </>
  )
}
