"use client"

import { useEffect, useRef } from "react"

import { toast } from "@/lib/toast"

type UseFilterToastOptions = {
  isFetching: boolean
  isPending: boolean
  isError: boolean
  error: unknown
  loadingMessage: string
  successMessage: string
  errorMessage?: string
}

export function useFilterToast({
  isFetching,
  isPending,
  isError,
  error,
  loadingMessage,
  successMessage,
  errorMessage = "Failed to load data",
}: UseFilterToastOptions) {
  const isInitialLoad = useRef(true)
  const pendingToastRef = useRef<{
    resolve: () => void
    reject: (error: Error) => void
  } | null>(null)

  useEffect(() => {
    if (isInitialLoad.current) {
      if (!isPending) {
        isInitialLoad.current = false
      }
      return
    }

    if (isFetching && !pendingToastRef.current) {
      const promise = new Promise<void>((resolve, reject) => {
        pendingToastRef.current = { resolve, reject }
      })

      toast.promise(promise, {
        loading: loadingMessage,
        success: successMessage,
        error: (err) =>
          err instanceof Error ? err.message : errorMessage,
      })
    }

    if (!isFetching && pendingToastRef.current) {
      if (isError) {
        pendingToastRef.current.reject(
          error instanceof Error ? error : new Error(errorMessage),
        )
      } else {
        pendingToastRef.current.resolve()
      }
      pendingToastRef.current = null
    }
  }, [
    isFetching,
    isPending,
    isError,
    error,
    loadingMessage,
    successMessage,
    errorMessage,
  ])
}
