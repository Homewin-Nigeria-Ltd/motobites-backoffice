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
  const urlBranchId = param && !Number.isNaN(Number(param)) ? Number(param) : null

  // Fallback to localStorage if searchParams does not specify a branch
  const [storedBranchId, setStoredBranchId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && !Number.isNaN(Number(saved))) {
      return Number(saved)
    }
    return null
  })

  const branchId = urlBranchId ?? storedBranchId

  // Synchronize localStorage or push stored branch to URL if URL doesn't specify one
  useEffect(() => {
    if (urlBranchId !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, String(urlBranchId))
      } catch {
        // ignore localStorage errors
      }
    } else if (storedBranchId !== null) {
      const nextParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      nextParams.set("branch_id", String(storedBranchId))
      const nextQuery = nextParams.toString()
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      router.replace(targetUrl, { scroll: false })
    }
  }, [urlBranchId, storedBranchId, searchParams, pathname, router])

  const setBranchId = useCallback(
    (id: number | string | null) => {
      const numericId =
        id !== null && id !== "" && !Number.isNaN(Number(id)) ? Number(id) : null

      setStoredBranchId(numericId)

      try {
        if (numericId !== null) {
          localStorage.setItem(STORAGE_KEY, String(numericId))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch {
        // ignore localStorage errors
      }

      const nextParams = new URLSearchParams(searchParams ? searchParams.toString() : "")
      if (numericId !== null) {
        nextParams.set("branch_id", String(numericId))
        nextParams.delete("fulfillment_branch_id")
      } else {
        nextParams.delete("branch_id")
        nextParams.delete("fulfillment_branch_id")
      }

      const nextQuery = nextParams.toString()
      const targetUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
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
      if (!branchId) return url
      if (/^https?:\/\//.test(url) || url.includes("branch_id=")) return url

      const [path, query] = url.split("?")
      const params = new URLSearchParams(query || "")
      params.set("branch_id", String(branchId))
      return `${path}?${params.toString()}`
    },
    [branchId]
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
