"use client"

import { useCallback, useState, useSyncExternalStore } from "react"

type SetSessionStorageValue<T> = (value: T | ((previous: T) => T)) => void

type SnapshotCacheEntry = {
  raw: string | null
  value: unknown
}

const snapshotCache = new Map<string, SnapshotCacheEntry>()

function readSessionStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const raw = window.sessionStorage.getItem(key)
    const cached = snapshotCache.get(key)

    if (cached && cached.raw === raw) {
      return cached.value as T
    }

    if (raw === null) {
      snapshotCache.set(key, { raw: null, value: initialValue })
      return initialValue
    }

    const value = JSON.parse(raw) as T
    snapshotCache.set(key, { raw, value })
    return value
  } catch {
    return initialValue
  }
}

function writeSessionStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const raw = JSON.stringify(value)
    window.sessionStorage.setItem(key, raw)
    snapshotCache.set(key, { raw, value })
  } catch {
    // Ignore quota errors and private browsing restrictions.
  }
}

export function dispatchSessionStorageChange(key: string) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(`session-storage:${key}`))
}

function subscribeToSessionStorage(key: string, onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      snapshotCache.delete(key)
      onStoreChange()
    }
  }

  const handleSessionChange = () => {
    snapshotCache.delete(key)
    onStoreChange()
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(`session-storage:${key}`, handleSessionChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(`session-storage:${key}`, handleSessionChange)
  }
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, SetSessionStorageValue<T>] {
  const [initial] = useState(initialValue)

  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToSessionStorage(key, onStoreChange),
    [key],
  )

  const getSnapshot = useCallback(
    () => readSessionStorageValue(key, initial),
    [initial, key],
  )

  const getServerSnapshot = useCallback(() => initial, [initial])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback<SetSessionStorageValue<T>>(
    (next) => {
      const current = readSessionStorageValue(key, initial)
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next

      writeSessionStorageValue(key, resolved)
      dispatchSessionStorageChange(key)
    },
    [initial, key],
  )

  return [value, setValue]
}
