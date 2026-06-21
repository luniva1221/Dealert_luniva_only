import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function syncAffiliateAnalytics() {
  logger.info('Starting affiliate analytics sync')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const topProducts = await prisma.affiliateClick.groupBy({
    by: ['productId'],
    _count: { productId: true },
    where: { clickedAt: { gte: thirtyDaysAgo } },
    orderBy: { _count: { productId: 'desc' } },
    take: 20,
  })

  logger.info('Affiliate sync complete', { topProducts: topProducts.length })
  return { topProducts }
}