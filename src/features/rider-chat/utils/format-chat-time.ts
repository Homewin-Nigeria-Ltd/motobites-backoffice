import {
  differenceInMinutes,
  format,
  isToday,
  isYesterday,
} from "date-fns"

function parseDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatChatConversationTime(isoDate: string) {
  const date = parseDate(isoDate)

  if (!date) {
    return isoDate
  }

  const now = new Date()
  const minutesAgo = differenceInMinutes(now, date)

  if (minutesAgo < 1) {
    return "Just now"
  }

  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`
  }

  if (isToday(date)) {
    return format(date, "h:mm a")
  }

  if (isYesterday(date)) {
    return "Yesterday"
  }

  const daysAgo = Math.floor(minutesAgo / (60 * 24))

  if (daysAgo < 7) {
    return format(date, "EEEE")
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MMM d")
  }

  return format(date, "MMM d, yyyy")
}

export function formatChatMessageTime(isoDate: string) {
  const date = parseDate(isoDate)

  if (!date) {
    return isoDate
  }

  const now = new Date()

  if (isToday(date)) {
    return format(date, "h:mm a")
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MMM d 'at' h:mm a")
  }

  return format(date, "MMM d, yyyy 'at' h:mm a")
}

export function formatChatDateDivider(isoDate: string) {
  const date = parseDate(isoDate)

  if (!date) {
    return isoDate
  }

  const now = new Date()

  if (isToday(date)) {
    return "Today"
  }

  if (isYesterday(date)) {
    return "Yesterday"
  }

  if (date.getFullYear() === now.getFullYear()) {
    return format(date, "EEEE, MMMM d")
  }

  return format(date, "EEEE, MMMM d, yyyy")
}

export function isSameChatDay(left: string, right: string) {
  const leftDate = parseDate(left)
  const rightDate = parseDate(right)

  if (!leftDate || !rightDate) {
    return false
  }

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  )
}
