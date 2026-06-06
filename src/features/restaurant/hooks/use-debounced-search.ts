"use client"

import { useEffect, useState } from "react"

const SEARCH_DEBOUNCE_MS = 300

export function useDebouncedSearch(initialValue = "") {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [value])

  return { value, setValue, debouncedValue }
}
