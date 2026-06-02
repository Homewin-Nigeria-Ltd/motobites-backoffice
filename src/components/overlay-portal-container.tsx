"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const OverlayPortalContainerContext =
  React.createContext<HTMLElement | null>(null)

type OverlayPortalContainerProps = {
  children: React.ReactNode
  className?: string
}

export function OverlayPortalContainer({
  children,
  className,
}: OverlayPortalContainerProps) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  return (
    <OverlayPortalContainerContext.Provider value={container}>
      <div ref={setContainer} className={cn("relative", className)}>
        {children}
      </div>
    </OverlayPortalContainerContext.Provider>
  )
}

export function useOverlayPortalContainer() {
  return React.useContext(OverlayPortalContainerContext)
}
