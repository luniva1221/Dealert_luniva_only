export interface Alert {
  id: string
  userId: string
  productId: string
  targetPrice: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AlertWithProduct extends Alert {
  product?: {
    name: string
    currentPrice: number
    imageUrl?: string
  }
}