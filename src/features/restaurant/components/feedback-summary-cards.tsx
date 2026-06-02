import type { FeedbackTag } from "@/features/restaurant/types"
import { cn } from "@/lib/utils"

function FeedbackCard({
  title,
  titleClassName,
  tags,
}: {
  title: string
  titleClassName: string
  tags: FeedbackTag[]
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <h2 className={cn("text-lg font-semibold", titleClassName)}>{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-sm text-foreground"
          >
            {tag.label}{" "}
            <span className="ml-1 text-muted-foreground">({tag.count})</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function FeedbackSummaryCards({
  compliments,
  improvements,
}: {
  compliments: FeedbackTag[]
  improvements: FeedbackTag[]
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FeedbackCard
        title="Compliments"
        titleClassName="text-foreground"
        tags={compliments}
      />
      <FeedbackCard
        title="Area for Improvement"
        titleClassName="text-destructive"
        tags={improvements}
      />
    </div>
  )
}
