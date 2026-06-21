import { getMongoDb } from '@/lib/mongodb'
import { productRepository } from '@/repositories/product.repository'
import { logger } from '@/lib/logger'

export async function buildMonthlyPriceIndex() {
  logger.info('Building monthly price index')

  const db = await getMongoDb()
  const categoryAverages = await productRepository.getCategoryAverages()

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const indexEntries = categoryAverages.map(item => ({
    month,
    category: item._id,
    averagePrice: Math.round(item.avgPrice),
    productCount: item.count,
    createdAt: now,
  }))

  if (indexEntries.length > 0) {
    await db.collection('price_index').insertMany(indexEntries)
  }

  logger.info('Price index built', { month, categories: indexEntries.length })
  return { month, categories: indexEntries.length }
}