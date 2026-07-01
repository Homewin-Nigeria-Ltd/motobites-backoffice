import type { ApiOrderReview } from "@/features/order/types"

export function formatOrderReviewText(
  review: ApiOrderReview | string | null | undefined
) {
  if (review == null) {
    return "—"
  }

  if (typeof review === "string") {
    return review.trim() || "—"
  }

  if (!review.comment?.trim()) {
    return "—"
  }

  return review.comment.trim()
}

export function formatOrderReviewRemark(
  review: ApiOrderReview | string | null | undefined
) {
  if (review == null || typeof review === "string") {
    return null
  }

  if (!review.remark?.trim()) {
    return null
  }

  return review.remark.trim()
}
