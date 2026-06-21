export interface NotificationLog {
  id: string
  userId: string
  alertId: string
  email: string
  status: 'SENT' | 'FAILED' | 'PENDING'
  sentAt: Date
}