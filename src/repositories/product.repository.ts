import { ObjectId } from 'mongodb'
import { getMongoDb } from '@/lib/mongodb'
import type { Product, PriceHistory } from '@/types/product'

// Raw documents as actually written by the crawler (snake_case).
// These never leave this file — every public method maps them into
// the camelCase `Product` / `PriceHistory` types from '@/types/product'.
interface RawProduct {
  _id: ObjectId
  item_id: string
  title: string
  url: string
  category: string
  seller_name: string
  last_seen: Date
  last_price: number
  first_seen: Date
  image_url: string
  image_verified: boolean
  is_delisted: boolean
}

interface RawPriceHistory {
  _id: ObjectId
  item_id: string
  crawl_run_id: string
  scraped_at: Date
  current_price: number
  original_price: number
  is_promotional: boolean
  category: string
}

// Escapes regex special characters so a category value with symbols
// (e.g. "Books & Stationery") can't break the pattern or be used for
// regex injection if this value ever comes from less-trusted input.
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Builds a case-insensitive, whitespace-trimmed exact-match filter.
// The crawler's stored category strings don't always match the
// frontend's display labels byte-for-byte (casing, stray whitespace),
// so a strict `===` match silently returns zero results on click —
// this is the actual cause of "category page shows nothing."
function categoryFilter(category: string) {
  return { $regex: `^${escapeRegex(category.trim())}$`, $options: 'i' }
}

// Case-insensitive substring match against the raw `title` field.
// Deliberately not $text — $text requires a text index on the
// collection (none exists), and only does whole-word/stemmed
// matching, which fails on partial input like "lap" -> "Laptop".
// This runs against raw documents (pre-$project), so it targets the
// snake_case `title` field, not the projected `name`.
function searchFilter(search: string) {
  return { $regex: escapeRegex(search.trim()), $options: 'i' }
}

export class ProductRepository {
  private async getCollection() {
    const db = await getMongoDb()
    return db.collection<RawProduct>('products')
  }

  private async getPriceHistoryCollection() {
    const db = await getMongoDb()
    return db.collection<RawPriceHistory>('price_history')
  }

  // Joins a product with its single most recent price_history record,
  // then projects everything into the exact `Product` shape the rest
  // of the app expects. This is the actual fix for "NPRNaN" — the
  // camelCase fields (currentPrice, name, itemId, etc.) never existed
  // on the raw documents; they have to be computed/renamed here.
  private buildProductPipeline(match: Record<string, unknown>) {
    return [
      { $match: match },
      {
        $lookup: {
          from: 'price_history',
          let: { itemId: '$item_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$item_id', '$$itemId'] } } },
            { $sort: { scraped_at: -1 } },
            { $limit: 1 },
          ],
          as: 'latestPrice',
        },
      },
      { $unwind: { path: '$latestPrice', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          computedCurrentPrice: { $ifNull: ['$latestPrice.current_price', '$last_price'] },
          computedOriginalPrice: { $ifNull: ['$latestPrice.original_price', '$last_price'] },
          computedDiscountPercentage: {
            $cond: [
              {
                $and: [
                  { $ne: ['$latestPrice.original_price', null] },
                  { $gt: ['$latestPrice.original_price', 0] },
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ['$latestPrice.original_price', '$latestPrice.current_price'] },
                          '$latestPrice.original_price',
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          id: { $toString: '$_id' },
          itemId: '$item_id',
          name: '$title',
          currentPrice: '$computedCurrentPrice',
          originalPrice: '$computedOriginalPrice',
          discountPercentage: '$computedDiscountPercentage',
          imageUrl: '$image_url',
          productUrl: '$url',
          category: '$category',
          sellerName: '$seller_name',
          inStock: { $eq: ['$is_delisted', false] },
          lastCrawledAt: '$last_seen',
          createdAt: '$first_seen',
        },
      },
    ]
  }

  async findById(id: string): Promise<Product | null> {
    const col = await this.getCollection()
    const match = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id }
    const results = await col.aggregate<Product>(this.buildProductPipeline(match)).toArray()
    return results[0] ?? null
  }

  async findByItemId(itemId: string): Promise<Product | null> {
    const col = await this.getCollection()
    const results = await col
      .aggregate<Product>(this.buildProductPipeline({ item_id: itemId }))
      .toArray()
    return results[0] ?? null
  }

  async findMany(options: {
    category?: string
    search?: string
    skip?: number
    limit?: number
    sortBy?: string
    sortOrder?: 1 | -1
  }): Promise<Product[]> {
    const col = await this.getCollection()
    const match: Record<string, unknown> = { is_delisted: false }
    if (options.category) match.category = categoryFilter(options.category)
    if (options.search) match.title = searchFilter(options.search)

    // sortBy comes in already camelCase from the API and now matches
    // the final projected field names directly, since sort happens
    // after $project in the pipeline below.
    const sortField = options.sortBy ?? 'lastCrawledAt'

    return col
      .aggregate<Product>([
        ...this.buildProductPipeline(match),
        { $sort: { [sortField]: options.sortOrder ?? -1 } },
        { $skip: options.skip ?? 0 },
        { $limit: options.limit ?? 20 },
      ])
      .toArray()
  }

  async countMany(options: { category?: string; search?: string }) {
    const col = await this.getCollection()
    const filter: Record<string, unknown> = { is_delisted: false }
    if (options.category) filter.category = categoryFilter(options.category)
    if (options.search) filter.title = searchFilter(options.search)
    return col.countDocuments(filter)
  }

  async findTrending(limit = 10): Promise<Product[]> {
    const col = await this.getCollection()
    return col
      .aggregate<Product>([
        ...this.buildProductPipeline({ is_delisted: false }),
        { $match: { discountPercentage: { $gte: 10 } } },
        { $sort: { discountPercentage: -1 } },
        { $limit: limit },
      ])
      .toArray()
  }

  async getPriceHistory(itemId: string): Promise<PriceHistory[]> {
    const col = await this.getPriceHistoryCollection()
    return col
      .aggregate<PriceHistory>([
        { $match: { item_id: itemId } },
        { $sort: { scraped_at: 1 } },
        {
          $project: {
            _id: { $toString: '$_id' },
            productId: '$item_id',
            price: '$current_price',
            recordedAt: '$scraped_at',
          },
        },
      ])
      .toArray()
  }

  async getCategoryAverages() {
    const col = await this.getPriceHistoryCollection()
    // Pricing only lives in price_history, so average per category is
    // computed from each item's latest snapshot, not from `products`.
    return col
      .aggregate([
        { $sort: { scraped_at: -1 } },
        {
          $group: {
            _id: '$item_id',
            category: { $first: '$category' },
            current_price: { $first: '$current_price' },
          },
        },
        {
          $group: {
            _id: '$category',
            avgPrice: { $avg: '$current_price' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()
  }
}

export const productRepository = new ProductRepository()