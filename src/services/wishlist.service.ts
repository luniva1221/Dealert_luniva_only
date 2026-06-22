import { ObjectId } from 'mongodb'
import { wishlistRepository } from '@/repositories/wishlist.repository'
import { productRepository } from '@/repositories/product.repository'
import { getMongoDb } from '@/lib/mongodb'

export class WishlistService {
  async getWishlist(userId: string) {
    const wishlistItems = await wishlistRepository.findByUserId(userId)

    const productIds = wishlistItems.map(item => item.productId)

    if (productIds.length === 0) {
      return []
    }

    const db = await getMongoDb()

    const products = await db
      .collection('products')
      .find({
        _id: { $in: productIds.map(id => new ObjectId(id)) }
      })
      .toArray()

    return products.map(product => ({
      ...product,
      id: product._id.toString(), // normalize MongoDB _id
    }))
  }

  async addToWishlist(userId: string, productId: string) {
    // 1. Validate product exists (MongoDB source of truth)
    const product = await productRepository.findById(productId)

    if (!product) {
      throw new Error('Product does not exist in the system catalog')
    }

    // 2. Prevent duplicates
    const existing = await wishlistRepository.findUnique(userId, productId)

    if (existing) {
      throw new Error('Product is already in your wishlist')
    }

    return wishlistRepository.create(userId, productId)
  }

  async removeFromWishlist(userId: string, productId: string) {
    const existing = await wishlistRepository.findUnique(userId, productId)

    if (!existing) {
      throw new Error('Product is not in your wishlist')
    }

    return wishlistRepository.delete(userId, productId)
  }

  async bulkAddToWishlist(userId: string, productIds: string[]) {
    // 1. Remove duplicates
    const deduplicatedIds = [...new Set(productIds)]

    if (deduplicatedIds.length === 0) {
      return { count: 0 }
    }

    const db = await getMongoDb()

    // 2. Validate against MongoDB (ObjectId conversion FIXED)
    const validProducts = await db
      .collection('products')
      .find({
        _id: { $in: deduplicatedIds.map(id => new ObjectId(id)) }
      })
      .project({ _id: 1 })
      .toArray()

    const validProductIds = validProducts.map(p => p._id.toString())

    if (validProductIds.length === 0) {
      throw new Error('None of the specified products exist in the catalog')
    }

    // 3. Store only valid IDs in wishlist repository (PostgreSQL layer)
    return wishlistRepository.bulkCreate(userId, validProductIds)
  }
}

export const wishlistService = new WishlistService()