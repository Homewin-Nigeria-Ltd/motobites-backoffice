"use client"

import { useCallback, useMemo } from "react"

import { useIsClient } from "@/hooks/use-is-client"
import { useSessionStorage } from "@/hooks/use-session-storage"
import { OFFLINE_ORDER_CART_STORAGE_KEY } from "../constants"
import type { OfflineOrderCartItem } from "../types"
import {
  buildCartLineId,
  getCartItemUnitPrice,
  normalizeCartItem,
  normalizeCartItems,
} from "../utils/cart-line"

export function useOfflineOrderCart() {
  const [items, setItems] = useSessionStorage<OfflineOrderCartItem[]>(
    OFFLINE_ORDER_CART_STORAGE_KEY,
    [],
  )
  const isHydrated = useIsClient()

  const persist = useCallback(
    (nextItems: OfflineOrderCartItem[]) => {
      setItems(nextItems)
    },
    [setItems],
  )

  const addItem = useCallback(
    (item: Omit<OfflineOrderCartItem, "quantity" | "lineId">) => {
      const addons = item.addons ?? []
      const basePrice = item.basePrice ?? item.price
      const lineId = buildCartLineId(
        item.itemId,
        addons.map((addon) => addon.id),
      )
      const normalized = normalizeCartItem({
        ...item,
        lineId,
        basePrice,
        price: getCartItemUnitPrice(basePrice, addons),
        addons,
        quantity: 1,
      })

      setItems((current) => {
        const existing = current.find((entry) => entry.lineId === lineId)
        return normalizeCartItems(
          existing
            ? current.map((entry) =>
                entry.lineId === lineId
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry,
              )
            : [...current, normalized],
        )
      })
    },
    [setItems],
  )

  const applyAddonSelection = useCallback(
    (item: Omit<OfflineOrderCartItem, "quantity" | "lineId">) => {
      const addons = item.addons ?? []
      const basePrice = item.basePrice ?? item.price
      const lineId = buildCartLineId(
        item.itemId,
        addons.map((addon) => addon.id),
      )

      setItems((current) => {
        const linesForItem = current.filter(
          (entry) => entry.itemId === item.itemId,
        )
        const preservedQuantity =
          linesForItem.reduce((sum, entry) => sum + entry.quantity, 0) || 1
        const withoutItemLines = current.filter(
          (entry) => entry.itemId !== item.itemId,
        )

        if (addons.length === 0) {
          return normalizeCartItems(withoutItemLines)
        }

        const normalized = normalizeCartItem({
          ...item,
          lineId,
          basePrice,
          price: getCartItemUnitPrice(basePrice, addons),
          addons,
          quantity: preservedQuantity,
        })

        return normalizeCartItems([...withoutItemLines, normalized])
      })
    },
    [setItems],
  )

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      setItems((current) =>
        normalizeCartItems(
          quantity <= 0
            ? current.filter((entry) => entry.lineId !== lineId)
            : current.map((entry) =>
                entry.lineId === lineId ? { ...entry, quantity } : entry,
              ),
        ),
      )
    },
    [setItems],
  )

  const decrementMenuItemQuantity = useCallback(
    (itemId: string) => {
      setItems((current) => {
        const targetIndex = [...current]
          .reverse()
          .findIndex((entry) => entry.itemId === itemId && entry.quantity > 0)

        if (targetIndex === -1) {
          return current
        }

        const index = current.length - 1 - targetIndex
        const target = current[index]

        return target.quantity <= 1
          ? current.filter((entry) => entry.lineId !== target.lineId)
          : current.map((entry) =>
              entry.lineId === target.lineId
                ? { ...entry, quantity: entry.quantity - 1 }
                : entry,
            )
      })
    },
    [setItems],
  )

  const removeItem = useCallback(
    (lineId: string) => {
      updateQuantity(lineId, 0)
    },
    [updateQuantity],
  )

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const normalizedItems = useMemo(() => normalizeCartItems(items), [items])

  const selectedCount = useMemo(
    () => normalizedItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [normalizedItems],
  )

  const subtotal = useMemo(
    () =>
      normalizedItems.reduce((sum, entry) => sum + entry.price * entry.quantity, 0),
    [normalizedItems],
  )

  const quantityByItemId = useMemo(
    () =>
      normalizedItems.reduce<Record<string, number>>((accumulator, entry) => {
        accumulator[entry.itemId] =
          (accumulator[entry.itemId] ?? 0) + entry.quantity
        return accumulator
      }, {}),
    [normalizedItems],
  )

  return {
    items: normalizedItems,
    selectedCount,
    subtotal,
    quantityByItemId,
    isHydrated,
    addItem,
    applyAddonSelection,
    updateQuantity,
    decrementMenuItemQuantity,
    removeItem,
    clearCart,
  }
}
