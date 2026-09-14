"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  Suspense,
  type ReactNode,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useFulfillmentBranches } from "@/features/restaurant/hooks/use-restaurant-queries"
import type { FulfillmentBranch } from "@/features/restaurant/types"

const STORAGE_KEY = "motobites_selected_branch_id"

export type BranchContextValue = {
  branchId: number | null
  selectedBranch: FulfillmentBranch | null
  branches: FulfillmentBranch[]
  activeBranches: FulfillmentBranch[]
  setBranchId: (id: number | string | null) => void
  formatBranchUrl: (url: string) => string
  isPending: boolean
}

const BranchContext = createContext<BranchContextValue | null>(null)

function BranchProviderInner({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { data: branches = [], isPending } = useFulfillmentBranches()

  const activeBranches = useMemo(
    () => branches.filter((b) => b.isActive),
    [branches]
  )

  // Parse branch from searchParams
  const param = searchParams?.get("branch_id") ?? searchParams?.get("fulfillment_branch_id")

  // Fallback to localStorage if searchParams does not specify a branch
  const [storedBranchId, setStoredBranchId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "all" || !saved) {
      return null
    }
    if (!Number.isNaN(Number(saved))) {
      return Number(saved)
    }
    return null
  })

  // BranchId resolution:
  // 1. If param is explicitly "all", branchId is null (All Branches)
  // 2. If param is a valid number, branchId is that number
  // 3. If param is not specified (bare URL), fall back to storedBranchId
  const branchId = useMemo(() => {
    if (param === "all") return null
    if (param && !Number.isNaN(Number(param))) return Number(param)
    return storedBranchId
  }, [param, storedBranchId])

  // Synchronize localStorage or push stored branch to URL if URL doesn't specify one
  useEffect(() => {
    if (param === "all") {
      try {
        localStorage.setItem(STORAGE_KEY, "all")
      } catch {
        // ignore localStorage errors
      }
      return
    }

    const numericUrlId =
      param && !Number.isNaN(Number(param)) ? Number(param) : null

    if (numericUrlId !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, String(numericUrlId))
      } catch {
        // ignore localStorage errors
      }
      return
    }

    // URL has neither branch_id nor fulfillment_branch_id (bare URL)
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (saved === "all") {
      const nextParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      nextParams.set("branch_id", "all")
      const nextQuery = nextParams.toString()
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      router.replace(targetUrl, { scroll: false })
    } else if (saved && !Number.isNaN(Number(saved))) {
      const nextParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      nextParams.set("branch_id", saved)
      const nextQuery = nextParams.toString()
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      router.replace(targetUrl, { scroll: false })
    }
  }, [param, searchParams, pathname, router])

  const setBranchId = useCallback(
    (id: number | string | null) => {
      const numericId =
        id !== null && id !== "" && id !== "all" && !Number.isNaN(Number(id)) ? Number(id) : null

      setStoredBranchId(numericId)

      try {
        if (numericId !== null) {
          localStorage.setItem(STORAGE_KEY, String(numericId))
        } else {
          localStorage.setItem(STORAGE_KEY, "all")
        }
      } catch {
        // ignore localStorage errors
      }

      const nextParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      if (numericId !== null) {
        nextParams.set("branch_id", String(numericId))
        nextParams.delete("fulfillment_branch_id")
      } else {
        nextParams.set("branch_id", "all")
        nextParams.delete("fulfillment_branch_id")
      }

      const nextQuery = nextParams.toString()
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", targetUrl)
      }
      router.replace(targetUrl, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const selectedBranch = useMemo(() => {
    if (branchId === null) return null
    return (
      branches.find((b) => String(b.id) === String(branchId)) ?? null
    )
  }, [branches, branchId])

  const formatBranchUrl = useCallback(
    (url: string) => {
      if (/^https?:\/\//.test(url) || url.includes("branch_id=")) return url

      const [path, query] = url.split("?")
      const params = new URLSearchParams(query || "")

      if (branchId !== null) {
        params.set("branch_id", String(branchId))
      } else if (param === "all") {
        params.set("branch_id", "all")
      } else {
        return url
      }

      const nextQuery = params.toString()
      return nextQuery ? `${path}?${nextQuery}` : path
    },
    [branchId, param]
  )

  const value = useMemo<BranchContextValue>(
    () => ({
      branchId,
      selectedBranch,
      branches,
      activeBranches,
      setBranchId,
      formatBranchUrl,
      isPending,
    }),
    [
      branchId,
      selectedBranch,
      branches,
      activeBranches,
      setBranchId,
      formatBranchUrl,
      isPending,
    ]
  )

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
}

export function BranchProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <BranchProviderInner>{children}</BranchProviderInner>
    </Suspense>
  )
}

export function useBranchFilter(): BranchContextValue {
  const context = useContext(BranchContext)
  if (!context) {
    return {
      branchId: null,
      selectedBranch: null,
      branches: [],
      activeBranches: [],
      setBranchId: () => {},
      formatBranchUrl: (url: string) => url,
      isPending: false,
    }
  }
  return context
}
