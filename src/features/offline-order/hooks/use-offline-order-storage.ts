"use client"

import { useCallback, useMemo } from "react"

import {
  dispatchSessionStorageChange,
  useSessionStorage,
} from "@/hooks/use-session-storage"
import {
  OFFLINE_ORDER_ACTIVE_SAVED_ID_KEY,
  OFFLINE_ORDER_CART_STORAGE_KEY,
  OFFLINE_ORDER_RECEIPT_STORAGE_KEY,
  OFFLINE_ORDER_SAVED_STORAGE_KEY,
} from "../constants"
import type {
  OfflineOrderCheckoutDraft,
  OfflineOrderCartItem,
  OfflineOrderReceipt,
  OfflineOrderSavedOrder,
} from "../types"
import { restoreCheckout } from "./use-offline-order-checkout"
import { generateOfflineOrderNumber } from "../utils/order-totals"

function createSavedOrderId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeSavedOrders(raw: unknown): OfflineOrderSavedOrder[] {
  if (!raw) {
    return []
  }

  if (Array.isArray(raw)) {
    return raw.filter(
      (entry): entry is OfflineOrderSavedOrder =>
        typeof entry === "object" &&
        entry != null &&
        "id" in entry &&
        "orderNumber" in entry &&
        "items" in entry &&
        "checkout" in entry &&
        "savedAt" in entry,
    )
  }

  if (
    typeof raw === "object" &&
    raw != null &&
    "items" in raw &&
    "checkout" in raw &&
    "savedAt" in raw
  ) {
    const legacy = raw as {
      items: OfflineOrderCartItem[]
      checkout: OfflineOrderCheckoutDraft
      savedAt: string
      id?: string
      orderNumber?: string
    }

    return [
      {
        id: legacy.id ?? createSavedOrderId(),
        orderNumber: legacy.orderNumber ?? generateOfflineOrderNumber(),
        items: legacy.items,
        checkout: legacy.checkout,
        savedAt: legacy.savedAt,
      },
    ]
  }

  return []
}

function readActiveSavedOrderId() {
  if (typeof window === "undefined") {
    return null
  }

  return window.sessionStorage.getItem(OFFLINE_ORDER_ACTIVE_SAVED_ID_KEY)
}

function writeActiveSavedOrderId(id: string | null) {
  if (typeof window === "undefined") {
    return
  }

  if (!id) {
    window.sessionStorage.removeItem(OFFLINE_ORDER_ACTIVE_SAVED_ID_KEY)
    return
  }

  window.sessionStorage.setItem(OFFLINE_ORDER_ACTIVE_SAVED_ID_KEY, id)
}

export function useOfflineOrderSaved() {
  const [rawSavedOrders, setRawSavedOrders] = useSessionStorage<unknown>(
    OFFLINE_ORDER_SAVED_STORAGE_KEY,
    [],
  )

  const savedOrders = useMemo(
    () => normalizeSavedOrders(rawSavedOrders),
    [rawSavedOrders],
  )

  const persist = useCallback(
    (orders: OfflineOrderSavedOrder[]) => {
      setRawSavedOrders(orders)
    },
    [setRawSavedOrders],
  )

  const saveOrder = useCallback(
    (items: OfflineOrderCartItem[], checkout: OfflineOrderCheckoutDraft) => {
      const order: OfflineOrderSavedOrder = {
        id: createSavedOrderId(),
        orderNumber: generateOfflineOrderNumber(),
        items,
        checkout,
        savedAt: new Date().toISOString(),
      }

      persist([order, ...savedOrders])
      return order
    },
    [persist, savedOrders],
  )

  const deleteSavedOrder = useCallback(
    (orderId: string) => {
      const next = savedOrders.filter((order) => order.id !== orderId)
      persist(next)

      if (readActiveSavedOrderId() === orderId) {
        writeActiveSavedOrderId(null)
      }
    },
    [persist, savedOrders],
  )

  const clearAllSavedOrders = useCallback(() => {
    persist([])
    writeActiveSavedOrderId(null)
  }, [persist])

  const resumeSavedOrder = useCallback(
    (orderId: string) => {
      const order = savedOrders.find((entry) => entry.id === orderId)
      if (!order) {
        return false
      }

      restoreCartItems(order.items)
      restoreCheckout(order.checkout)
      writeActiveSavedOrderId(orderId)
      return true
    },
    [savedOrders],
  )

  const clearActiveSavedOrder = useCallback(() => {
    const activeId = readActiveSavedOrderId()
    if (!activeId) {
      return
    }

    deleteSavedOrder(activeId)
    writeActiveSavedOrderId(null)
  }, [deleteSavedOrder])

  return {
    savedOrders,
    savedOrderCount: savedOrders.length,
    hasSavedOrders: savedOrders.length > 0,
    saveOrder,
    deleteSavedOrder,
    clearAllSavedOrders,
    resumeSavedOrder,
    clearActiveSavedOrder,
  }
}

export function useOfflineOrderReceipt() {
  const [receipt, setReceipt] = useSessionStorage<OfflineOrderReceipt | null>(
    OFFLINE_ORDER_RECEIPT_STORAGE_KEY,
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

export function restoreCartItems(items: OfflineOrderCartItem[]) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    OFFLINE_ORDER_CART_STORAGE_KEY,
    JSON.stringify(items),
  )
  dispatchSessionStorageChange(OFFLINE_ORDER_CART_STORAGE_KEY)
}

export { restoreCheckout } from "./use-offline-order-checkout"
