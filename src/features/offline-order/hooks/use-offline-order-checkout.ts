"use client"

import { useCallback } from "react"

import {
  dispatchSessionStorageChange,
  useSessionStorage,
} from "@/hooks/use-session-storage"
import { OFFLINE_ORDER_CHECKOUT_STORAGE_KEY } from "../constants"
import type {
  OfflineOrderCheckoutDraft,
  OfflineOrderOrderSource,
  OfflineOrderPaymentMethod,
} from "../types"
import {
  normalizeOrderSourceFromApi,
  normalizePaymentMethodFromApi,
} from "../utils/order-checkout"

const defaultCheckout: OfflineOrderCheckoutDraft = {
  customerName: "",
  customerPhone: "",
  orderSource: "walk_in",
  paymentMethod: "cash",
  takenById: "",
  takenByName: "",
  managerVerificationNotes: "",
}

export function useOfflineOrderCheckout() {
  const [storedCheckout, setStoredCheckout] =
    useSessionStorage<OfflineOrderCheckoutDraft>(
      OFFLINE_ORDER_CHECKOUT_STORAGE_KEY,
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

  const setManagerVerificationNotes = useCallback(
    (managerVerificationNotes: string) =>
      updateCheckout({ managerVerificationNotes }),
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
    setManagerVerificationNotes,
    resetCheckout,
  }
}

export function restoreCheckout(checkout: OfflineOrderCheckoutDraft) {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.setItem(
    OFFLINE_ORDER_CHECKOUT_STORAGE_KEY,
    JSON.stringify(checkout),
  )
  dispatchSessionStorageChange(OFFLINE_ORDER_CHECKOUT_STORAGE_KEY)
}
