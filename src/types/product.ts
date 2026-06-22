export interface Product {
  _id: string
  id: string
  itemId: string
  name: string
  currentPrice: number
  originalPrice: number
  discountPercentage: number
  imageUrl: string
  productUrl: string
  category: string
  sellerName: string
  inStock: boolean
  lastCrawledAt: Date
  createdAt: Date
}

export interface PriceHistory {
  _id: string
  productId: string
  price: number
  recordedAt: Date
}

export interface ProductWithHistory extends Product {
  priceHistory: PriceHistory[]
}