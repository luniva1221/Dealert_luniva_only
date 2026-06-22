import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Product } from './useProducts'

export function useWishlist() {
  const queryClient = useQueryClient()

  // Query to fetch full wishlist products
  const { data: wishlistProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist')
      if (!res.ok) {
        // Return empty array if unauthorized/not logged in
        if (res.status === 401) return []
        throw new Error('Failed to fetch wishlist')
      }
      const data = await res.json()
      return data.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      }))
    },
    retry: false,
  })

  // List of wishlisted product IDs
  const wishlistItems = wishlistProducts.map(p => p.id)

  const isWishlisted = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  // Mutation to add single product
  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to add to wishlist')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  // Mutation to remove single product
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to remove from wishlist')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  // Mutation to bulk add products
  const bulkAddMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      const res = await fetch('/api/wishlist/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to bulk add to wishlist')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  // Toggle helper
  const toggleWishlist = async (productId: string) => {
    if (isWishlisted(productId)) {
      await removeMutation.mutateAsync(productId)
    } else {
      await addMutation.mutateAsync(productId)
    }
  }

  return {
    wishlistProducts,
    wishlistItems,
    isLoading,
    isWishlisted,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    bulkAddToWishlist: bulkAddMutation.mutateAsync,
    toggleWishlist,
  }
}
