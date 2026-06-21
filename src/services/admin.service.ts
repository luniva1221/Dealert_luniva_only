import { getMongoDb } from '@/lib/mongodb'
import { prisma } from '@/lib/prisma'
import { appConfig } from '@/config/app.config'

export class AdminService {
  async getCrawlLogs(options: { page?: number; limit?: number; status?: string }) {
    const db = await getMongoDb()
    const limit = options.limit ?? appConfig.pagination.defaultLimit
    const skip = ((options.page ?? 1) - 1) * limit
    const filter = options.status ? { status: options.status } : {}

    const [logs, total] = await Promise.all([
      db.collection('crawl_logs').find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('crawl_logs').countDocuments(filter),
    ])

    return { logs, total, page: options.page ?? 1, limit }
  }

  async getCrawlErrors(options: { page?: number; limit?: number }) {
    const db = await getMongoDb()
    const limit = options.limit ?? appConfig.pagination.defaultLimit
    const skip = ((options.page ?? 1) - 1) * limit

    const [errors, total] = await Promise.all([
      db.collection('errors').find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection('errors').countDocuments(),
    ])

    return { errors, total }
  }

  async getAffiliateStats() {
    const [totalClicks, clicksToday, clicksThisMonth] = await Promise.all([
      prisma.affiliateClick.count(),
      prisma.affiliateClick.count({
        where: {
          clickedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.affiliateClick.count({
        where: {
          clickedAt: { gte: new Date(new Date().setDate(1)) },
        },
      }),
    ])

    const topProducts = await prisma.affiliateClick.groupBy({
      by: ['productId'],
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 10,
    })

    return { totalClicks, clicksToday, clicksThisMonth, topProducts }
  }

  async getDashboardStats() {
    const db = await getMongoDb()

    const [totalUsers, totalProducts, activeAlerts, totalNotifications] = await Promise.all([
      prisma.user.count(),
      db.collection('products').countDocuments(),
      prisma.alert.count({ where: { isActive: true } }),
      prisma.notificationLog.count(),
    ])

    return { totalUsers, totalProducts, activeAlerts, totalNotifications }
  }
}

export const adminService = new AdminService()