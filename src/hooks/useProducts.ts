import { useQuery } from '@tanstack/react-query'
import type { Product, PriceHistory, ProductWithHistory } from '@/types/product'

export type { Product, PriceHistory, ProductWithHistory }

export interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useProducts(filters?: {
  search?: string
  category?: string
  sortBy?: string
  limit?: number
}) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      // "All" category is treated as no category filter on the backend
      if (filters?.category && filters.category !== 'All') {
        params.append('category', filters.category)
      }
      if (filters?.sortBy && filters.sortBy !== 'default') {
        if (filters.sortBy === 'price-low') {
          params.append('sortBy', 'currentPrice')
          params.append('sortOrder', 'asc')
        } else if (filters.sortBy === 'price-high') {
          params.append('sortBy', 'currentPrice')
          params.append('sortOrder', 'desc')
        } else if (filters.sortBy === 'discount') {
          params.append('sortBy', 'discountPercentage')
          params.append('sortOrder', 'desc')
        } else {
          params.append('sortBy', filters.sortBy)
        }
      }
      if (filters?.limit) {
        params.append('limit', String(filters.limit))
      } else {
        params.append('limit', '100')
      }

      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data: ProductsResponse = await res.json()
      return data.products.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      }))
    },
  })
}

export function useProductDetails(itemId: string) {
  return useQuery<ProductWithHistory>({
    queryKey: ['product', itemId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${itemId}`)
      if (!res.ok) throw new Error('Product not found')
      const p = await res.json()
      return {
        ...p,
        id: p._id || p.id,
      }
    },
    enabled: !!itemId,
  })
}