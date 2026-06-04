"use client"

import { useEffect } from "react"

import { ErrorView } from "@/components/error-view"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <ErrorView error={error} onRetry={reset} variant="fullscreen" />
}
