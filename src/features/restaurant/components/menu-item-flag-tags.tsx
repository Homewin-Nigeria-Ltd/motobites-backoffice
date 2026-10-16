import type { Menu } from "@/features/restaurant/types"
import { cn } from "@/lib/utils"

type MenuItemFlagTagsProps = {
  menu: Pick<Menu, "isPopular" | "isCombo" | "isChefsPick">
  className?: string
}

export function MenuItemFlagTags({ menu, className }: MenuItemFlagTagsProps) {
  const tags = [
    menu.isPopular ? "Popular" : null,
    menu.isCombo ? "Combo" : null,
    menu.isChefsPick ? "Chef's pick" : null,
  ].filter((tag): tag is string => Boolean(tag))

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-primary"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
