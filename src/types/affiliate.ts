export interface AffiliateClick {
  id: string
  userId?: string
  productId: string
  affiliateLink: string
  clickedAt: Date
}

export interface AffiliateStats {
  totalClicks: number
  uniqueProducts: number
  clicksToday: number
  clicksThisMonth: number
}