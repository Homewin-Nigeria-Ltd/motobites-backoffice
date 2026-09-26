"use client"

import { useEffect, useState, type RefObject } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

const SHOW_AFTER_PX = 240

export function ScrollToTop({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>
}) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const onScroll = () => {
      setVisible(container.scrollTop > SHOW_AFTER_PX)
    }

    onScroll()
    container.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      container.removeEventListener("scroll", onScroll)
    }
  }, [containerRef, pathname])

  if (!visible) {
    return null
  }

  return (
    <Button
      type="button"
      size="icon"
      className="fixed right-4 bottom-4 z-50 size-10 rounded-full shadow-md"
      aria-label="Back to top"
      onClick={() => {
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
      }}
    >
      <Icons.arrowUp size={18} />
    </Button>
  )
}
