export type BroadcastNotificationType = "in_app" | "sms"

export type BroadcastNotificationInput = {
  type: BroadcastNotificationType
  title: string
  message: string
  user_ids?: number[]
}

export type BroadcastCustomerOption = {
  userId: number
  name: string
  email: string
}
