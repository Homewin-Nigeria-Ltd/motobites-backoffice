"use client"

import { useCallback, useMemo } from "react"

import {
  dispatchSessionStorageChange,
  useSessionStorage,
} from "@/hooks/use-session-storage"
import { useIsClient } from "@/hooks/use-is-client"

import {
  BULK_ORDER_ACTIVE_SAVED_ID_KEY,
  BULK_ORDER_CART_STORAGE_KEY,
  BULK_ORDER_SOURCE_STORAGE_KEY,
  DEFAULT_BULK_ORDER_SOURCE,
} from "../constants"
import type {
  BulkOrderAddon,
  BulkOrderCartItem,
  BulkOrderCatalogItem,
  BulkOrderSource,
} from "../types"
import { getBulkOrderItemKind, getBulkOrderUnitPrice } from "../utils/catalog"
import { resolveBulkLineType } from "../utils/build-payload"

function toCartItem(
  item: BulkOrderCatalogItem,
  quantity: number,
  addons: BulkOrderAddon[] = [],
): BulkOrderCartItem {
  return {
    itemId: item.id,
    menuItemId: item.menuItemId,
    name: item.name,
    basePrice: item.price,
    price: getBulkOrderUnitPrice(item.price, addons),
    image: item.image,
    kitchenId: item.kitchenId,
    kitchenName: item.kitchenName,
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    quantity,
    kind: item.kind,
    lineType: item.lineType,
    allocationRole: item.allocationRole,
    addons: addons ?? [],
  }
}

function normalizeCartItem(item: BulkOrderCartItem): BulkOrderCartItem {
  const kind = item.kind ?? getBulkOrderItemKind(item.categoryName)
  const lineType = item.lineType ?? resolveBulkLineType({ ...item, kind })
  const menuItemId =
    typeof item.menuItemId === "number" && Number.isFinite(item.menuItemId)
      ? item.menuItemId
      : Number(item.itemId.replace(/^addon-\d+-/, ""))

  return {
    ...item,
    menuItemId,
    kind,
    lineType,
    allocationRole: item.allocationRole ?? lineType,
    addons: item.addons ?? [],
  }
}

export function useBulkOrderCart() {
  const [rawItems, setItems] = useSessionStorage<BulkOrderCartItem[]>(
    BULK_ORDER_CART_STORAGE_KEY,
    [],
  )
  const [source, setSource] = useSessionStorage<BulkOrderSource>(
    BULK_ORDER_SOURCE_STORAGE_KEY,
    DEFAULT_BULK_ORDER_SOURCE,
  )
  const isHydrated = useIsClient()
  const items = useMemo(
    () => (rawItems ?? []).map(normalizeCartItem),
    [rawItems],
  )

  const addItem = useCallback(
    (item: BulkOrderCatalogItem, addons: BulkOrderAddon[] = []) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.itemId === item.id)

        if (existing) {
          return current.map((entry) =>
            entry.itemId === item.id
              ? {
                  ...normalizeCartItem(entry),
                  addons,
                  price: getBulkOrderUnitPrice(item.price, addons),
                  quantity: entry.quantity + 1,
                }
              : entry,
          )
        }

        return [...current, toCartItem(item, 1, addons)]
      })
    },
    [setItems],
  )

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      setItems((current) => {
        if (quantity <= 0) {
          return current.filter((entry) => entry.itemId !== itemId)
        }

        return current.map((entry) =>
          entry.itemId === itemId ? { ...entry, quantity } : entry,
        )
      })
    },
    [setItems],
  )

  const setItemAddons = useCallback(
    (item: BulkOrderCatalogItem, addons: BulkOrderAddon[]) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.itemId === item.id)

        if (!existing) {
          return [...current, toCartItem(item, 1, addons)]
        }

        return current.map((entry) =>
          entry.itemId === item.id
            ? {
                ...entry,
                addons,
                price: getBulkOrderUnitPrice(item.price, addons),
              }
            : entry,
        )
      })
    },
    [setItems],
  )

  const removeItem = useCallback(
    (itemId: string) => {
      setItems((current) =>
        current.filter((entry) => {
          if (entry.itemId === itemId) {
            return false
          }

          return !entry.itemId.startsWith(`addon-${itemId}-`)
        }),
      )
    },
    [setItems],
  )

  const clearCart = useCallback(() => {
    setItems([])
    writeActiveSavedOrderId(null)
  }, [setItems])

  const quantityByItemId = useMemo(
    () =>
      Object.fromEntries(items.map((item) => [item.itemId, item.quantity])),
    [items],
  )

  const addonsByItemId = useMemo(
    () => Object.fromEntries(items.map((item) => [item.itemId, item.addons])),
    [items],
  )

  const selectedCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const portionCount = useMemo(
    () =>
      items.reduce((sum, item) => {
        return item.kind === "portion" || item.lineType === "primary"
          ? sum + item.quantity
          : sum
      }, 0),
    [items],
  )

  const sideCount = selectedCount - portionCount

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  return {
    items,
    source,
    setSource,
    isHydrated,
    quantityByItemId,
    addonsByItemId,
    selectedCount,
    portionCount,
    sideCount,
    subtotal,
    addItem,
    updateQuantity,
    setItemAddons,
    removeItem,
    clearCart,
  }
}

export function restoreBulkOrderCart(items: BulkOrderCartItem[]) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    BULK_ORDER_CART_STORAGE_KEY,
    JSON.stringify(items),
  )
  dispatchSessionStorageChange(BULK_ORDER_CART_STORAGE_KEY)
}

export function restoreBulkOrderSource(source: BulkOrderSource) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    BULK_ORDER_SOURCE_STORAGE_KEY,
    JSON.stringify(source),
  )
  dispatchSessionStorageChange(BULK_ORDER_SOURCE_STORAGE_KEY)
}

export function readActiveSavedOrderId() {
  if (typeof window === "undefined") {
    return null
  }

  return window.sessionStorage.getItem(BULK_ORDER_ACTIVE_SAVED_ID_KEY)
}

export function writeActiveSavedOrderId(id: string | null) {
  if (typeof window === "undefined") {
    return
  }

  if (!id) {
    window.sessionStorage.removeItem(BULK_ORDER_ACTIVE_SAVED_ID_KEY)
    return
  }

  window.sessionStorage.setItem(BULK_ORDER_ACTIVE_SAVED_ID_KEY, id)
}
