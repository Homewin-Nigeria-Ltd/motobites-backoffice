"use client"

import { useCallback, useState, useSyncExternalStore } from "react"

type SetLocalStorageValue<T> = (value: T | ((previous: T) => T)) => void

type SnapshotCacheEntry = {
  raw: string | null
  value: unknown
}

const snapshotCache = new Map<string, SnapshotCacheEntry>()

function readLocalStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const raw = window.localStorage.getItem(key)
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

function writeLocalStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return
  }

  try {
    const raw = JSON.stringify(value)
    window.localStorage.setItem(key, raw)
    snapshotCache.set(key, { raw, value })
  } catch {
    // Ignore quota errors and private browsing restrictions.
  }
}

function dispatchLocalStorageChange(key: string) {
  window.dispatchEvent(new Event(`local-storage:${key}`))
}

function subscribeToLocalStorage(key: string, onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      snapshotCache.delete(key)
      onStoreChange()
    }
  }

  const handleLocalChange = () => {
    snapshotCache.delete(key)
    onStoreChange()
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(`local-storage:${key}`, handleLocalChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(`local-storage:${key}`, handleLocalChange)
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetLocalStorageValue<T>] {
  const [initial] = useState(initialValue)

  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToLocalStorage(key, onStoreChange),
    [key],
  )

  const getSnapshot = useCallback(
    () => readLocalStorageValue(key, initial),
    [initial, key],
  )

  const getServerSnapshot = useCallback(() => initial, [initial])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback<SetLocalStorageValue<T>>(
    (next) => {
      const current = readLocalStorageValue(key, initial)
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next

      writeLocalStorageValue(key, resolved)
      dispatchLocalStorageChange(key)
    },
    [initial, key],
  )

  return [value, setValue]
}
