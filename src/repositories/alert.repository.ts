import { prisma } from '@/lib/prisma'
import type { Alert, Prisma } from '@prisma/client'

export class AlertRepository {
  async findById(id: string): Promise<Alert | null> {
    return prisma.alert.findUnique({ where: { id } })
  }

  async findByUserId(userId: string): Promise<Alert[]> {
    return prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findActiveAlerts(): Promise<Alert[]> {
    return prisma.alert.findMany({
      where: { isActive: true },
      include: { user: { select: { email: true, fullName: true } } },
    })
  }

  async findByProductId(productId: string): Promise<Alert[]> {
    return prisma.alert.findMany({ where: { productId, isActive: true } })
  }

  async create(data: Prisma.AlertCreateInput): Promise<Alert> {
    return prisma.alert.create({ data })
  }

  async update(id: string, data: Prisma.AlertUpdateInput): Promise<Alert> {
    return prisma.alert.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Alert> {
    return prisma.alert.delete({ where: { id } })
  }

  async deactivate(id: string): Promise<Alert> {
    return prisma.alert.update({ where: { id }, data: { isActive: false } })
  }
}

export const alertRepository = new AlertRepository()