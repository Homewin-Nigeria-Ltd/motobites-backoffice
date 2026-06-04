"use client"

import { useEffect } from "react"

import { ErrorView } from "@/components/error-view"

import "./globals.css"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-full flex-col font-sans antialiased">
        <ErrorView error={error} onRetry={reset} variant="fullscreen" />
      </body>
    </html>
  )
}
