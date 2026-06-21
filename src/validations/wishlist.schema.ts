import { z } from 'zod'

export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

export const bulkAddToWishlistSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1, 'At least one Product ID is required'),
})

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>
export type BulkAddToWishlistInput = z.infer<typeof bulkAddToWishlistSchema>
