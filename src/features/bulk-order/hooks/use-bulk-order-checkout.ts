"use client"

import { useCallback } from "react"

import {
  dispatchSessionStorageChange,
  useSessionStorage,
} from "@/hooks/use-session-storage"
import type {
  OfflineOrderCheckoutDraft,
  OfflineOrderOrderSource,
  OfflineOrderPaymentMethod,
} from "@/features/offline-order/types"
import {
  normalizeOrderSourceFromApi,
  normalizePaymentMethodFromApi,
} from "@/features/offline-order/utils/order-checkout"

import { BULK_ORDER_CHECKOUT_STORAGE_KEY } from "../constants"

const defaultCheckout: OfflineOrderCheckoutDraft = {
  customerName: "",
  customerPhone: "",
  orderSource: "walk_in",
  paymentMethod: "cash",
  takenById: "",
  takenByName: "",
  branchId: null,
  branchName: "",
  managerVerificationNotes: "",
  promoCode: "",
}

export function useBulkOrderCheckout() {
  const [storedCheckout, setStoredCheckout] =
    useSessionStorage<OfflineOrderCheckoutDraft>(
      BULK_ORDER_CHECKOUT_STORAGE_KEY,
      defaultCheckout,
    )

  const checkout = {
    ...defaultCheckout,
    ...storedCheckout,
    paymentMethod: normalizePaymentMethodFromApi(storedCheckout.paymentMethod),
    orderSource: normalizeOrderSourceFromApi(storedCheckout.orderSource),
  }

  const updateCheckout = useCallback(
    (patch: Partial<OfflineOrderCheckoutDraft>) => {
      setStoredCheckout((current) => ({
        ...defaultCheckout,
        ...current,
        ...patch,
      }))
    },
    [setStoredCheckout],
  )

  const setCustomerName = useCallback(
    (customerName: string) => updateCheckout({ customerName }),
    [updateCheckout],
  )

  const setCustomerPhone = useCallback(
    (customerPhone: string) => updateCheckout({ customerPhone }),
    [updateCheckout],
  )

  const setOrderSource = useCallback(
    (orderSource: OfflineOrderOrderSource) => updateCheckout({ orderSource }),
    [updateCheckout],
  )

  const setPaymentMethod = useCallback(
    (paymentMethod: OfflineOrderPaymentMethod) =>
      updateCheckout({ paymentMethod }),
    [updateCheckout],
  )

  const setTakenBy = useCallback(
    (takenById: string, takenByName: string) =>
      updateCheckout({ takenById, takenByName }),
    [updateCheckout],
  )

  const setBranch = useCallback(
    (branchId: number | null, branchName?: string | null) =>
      updateCheckout({ branchId, branchName: branchName ?? "" }),
    [updateCheckout],
  )

  const setManagerVerificationNotes = useCallback(
    (managerVerificationNotes: string) =>
      updateCheckout({ managerVerificationNotes }),
    [updateCheckout],
  )

  const setPromoCode = useCallback(
    (promoCode: string) => updateCheckout({ promoCode }),
    [updateCheckout],
  )

  const resetCheckout = useCallback(() => {
    setStoredCheckout(defaultCheckout)
  }, [setStoredCheckout])

  return {
    checkout,
    setCustomerName,
    setCustomerPhone,
    setOrderSource,
    setPaymentMethod,
    setTakenBy,
    setBranch,
    setManagerVerificationNotes,
    setPromoCode,
    resetCheckout,
  }
}

export function restoreBulkOrderCheckout(checkout: OfflineOrderCheckoutDraft) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    BULK_ORDER_CHECKOUT_STORAGE_KEY,
    JSON.stringify(checkout),
  )
  dispatchSessionStorageChange(BULK_ORDER_CHECKOUT_STORAGE_KEY)
}
