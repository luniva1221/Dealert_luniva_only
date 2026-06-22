import { productRepository } from '@/repositories/product.repository'
import { appConfig } from '@/config/app.config'

export class ProductService {
  async getProducts(options: {
    category?: string
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const limit = Math.min(options.limit ?? appConfig.pagination.defaultLimit, appConfig.pagination.maxLimit)
    const page = Math.max(options.page ?? 1, 1)
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      productRepository.findMany({
        category: options.category,
        search: options.search,
        skip,
        limit,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder === 'asc' ? 1 : -1,
      }),
      productRepository.countMany({
        category: options.category,
        search: options.search,
      }),
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id)
    if (!product) throw new Error('Product not found')

    const priceHistory = await productRepository.getPriceHistory(product.itemId)
  return { ...product, priceHistory }
  }

  async getTrendingDeals(limit = 20) {
    return productRepository.findTrending(limit)
  }

  async getPriceIndex() {
    const categoryAverages = await productRepository.getCategoryAverages()
    return categoryAverages.map(item => ({
      category: item._id,
      averagePrice: Math.round(item.avgPrice),
      productCount: item.count,
    }))
  }

  buildAffiliateUrl(productUrl: string): string {
    const url = new URL(productUrl)
    url.searchParams.set('aff_id', appConfig.daraz.affiliateTag)
    return url.toString()
  }
}

export const productService = new ProductService()