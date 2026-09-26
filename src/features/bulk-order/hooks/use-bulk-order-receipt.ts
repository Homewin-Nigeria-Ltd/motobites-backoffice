"use client"

import { useCallback } from "react"

import { useSessionStorage } from "@/hooks/use-session-storage"
import type { OfflineOrderReceipt } from "@/features/offline-order/types"

import { BULK_ORDER_RECEIPT_STORAGE_KEY } from "../constants"

export function useBulkOrderReceipt() {
  const [receipt, setReceipt] = useSessionStorage<OfflineOrderReceipt | null>(
    BULK_ORDER_RECEIPT_STORAGE_KEY,
    null,
  )

  const storeReceipt = useCallback(
    (nextReceipt: OfflineOrderReceipt) => {
      setReceipt(nextReceipt)
    },
    [setReceipt],
  )

  const clearReceipt = useCallback(() => {
    setReceipt(null)
  }, [setReceipt])

  return {
    receipt,
    storeReceipt,
    clearReceipt,
  }
}
