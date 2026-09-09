"use client"

import { Suspense, type ReactNode } from "react"

import { useIsClient } from "@/hooks/use-is-client"

type ClientSuspenseProps = {
  children: ReactNode
  fallback: ReactNode
}

export function ClientSuspense({ children, fallback }: ClientSuspenseProps) {
  const mounted = useIsClient()

  if (!mounted) {
    return fallback
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}
