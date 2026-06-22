import { prisma } from '@/lib/prisma'
import type { NotificationLog, Prisma } from '@prisma/client'

export class NotificationRepository {
  async create(data: Prisma.NotificationLogCreateInput): Promise<NotificationLog> {
    return prisma.notificationLog.create({ data })
  }

  async findByUserId(userId: string, limit = 20): Promise<NotificationLog[]> {
    return prisma.notificationLog.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit,
    })
  }

  async findByAlertId(alertId: string): Promise<NotificationLog[]> {
    return prisma.notificationLog.findMany({
      where: { alertId },
      orderBy: { sentAt: 'desc' },
    })
  }

  async updateStatus(id: string, status: 'SENT' | 'FAILED'): Promise<NotificationLog> {
    return prisma.notificationLog.update({ where: { id }, data: { status } })
  }
}

export const notificationRepository = new NotificationRepository()