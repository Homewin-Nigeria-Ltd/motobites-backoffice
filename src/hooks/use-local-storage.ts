"use client"

import { useCallback, useSyncExternalStore } from "react"

type SetLocalStorageValue<T> = (value: T | ((previous: T) => T)) => void

function readLocalStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const item = window.localStorage.getItem(key)

    if (item === null) {
      return initialValue
    }

    return JSON.parse(item) as T
  } catch {
    return initialValue
  }
}

function writeLocalStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
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
      onStoreChange()
    }
  }

  const handleLocalChange = () => {
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
  initialValue: T
): [T, SetLocalStorageValue<T>] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToLocalStorage(key, onStoreChange),
    [key]
  )

  const getSnapshot = useCallback(
    () => readLocalStorageValue(key, initialValue),
    [initialValue, key]
  )

  const getServerSnapshot = useCallback(() => initialValue, [initialValue])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback<SetLocalStorageValue<T>>(
    (next) => {
      const current = readLocalStorageValue(key, initialValue)
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(current)
          : next

      writeLocalStorageValue(key, resolved)
      dispatchLocalStorageChange(key)
    },
    [initialValue, key]
  )

  return [value, setValue]
}
