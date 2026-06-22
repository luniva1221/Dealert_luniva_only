import { prisma } from '@/lib/prisma'
import type { WishlistItem } from '@prisma/client'

export class WishlistRepository {
  async findByUserId(userId: string): Promise<WishlistItem[]> {
    return prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findUnique(userId: string, productId: string): Promise<WishlistItem | null> {
    return prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })
  }

  async create(userId: string, productId: string): Promise<WishlistItem> {
    return prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    })
  }

  async delete(userId: string, productId: string): Promise<WishlistItem> {
    return prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })
  }

  async bulkCreate(userId: string, productIds: string[]): Promise<{ count: number }> {
    // Wrap database inserts in a Prisma transaction
    return prisma.$transaction(async (tx) => {
      let inserted = 0
      for (const productId of productIds) {
        // Double check existence in database to prevent transaction error
        const existing = await tx.wishlistItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        })

        if (!existing) {
          await tx.wishlistItem.create({
            data: {
              userId,
              productId,
            },
          })
          inserted++
        }
      }
      return { count: inserted }
    })
  }
}

export const wishlistRepository = new WishlistRepository()
