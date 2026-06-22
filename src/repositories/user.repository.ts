import { prisma } from '@/lib/prisma'
import type { User, Prisma } from '@prisma/client'

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } })
  }

  async findAll(options?: { skip?: number; take?: number }) {
    return prisma.user.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    })
  }

  async upsertOAuthAccount(data: {
    userId: string
    provider: string
    providerUserId: string
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: Date | null
  }) {
    return prisma.oAuthAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: data.provider,
          providerUserId: data.providerUserId,
        },
      },
      update: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      },
      create: {
        provider: data.provider,
        providerUserId: data.providerUserId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        user: { connect: { id: data.userId } },
      },
    })
  }
}

export const userRepository = new UserRepository()