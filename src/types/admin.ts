export interface CrawlLog {
  id: string
  source: string
  status: string
  startedAt: string
  finishedAt: string
  productsCrawled: number
  failureReason?: string | null
}

export interface SystemError {
  id: string
  message: string
  component: string
  severity: string
  stackTrace?: string | null
  timestamp: string
}
