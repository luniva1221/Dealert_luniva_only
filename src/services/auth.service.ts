import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { userRepository } from '@/repositories/user.repository'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { setAuthCookies, clearAuthCookies } from '@/lib/cookies'
import { authConfig } from '@/config/auth.config'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import type { RegisterInput, LoginInput } from '@/validations/auth.schema'

// In-memory token store for dev. Replace with Redis in production.
const verificationTokens = new Map<string, { email: string; expiresAt: number }>()
const resetTokens = new Map<string, { email: string; expiresAt: number }>()

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) {
      throw new Error('An account with this email already exists')
    }

    const passwordHash = await bcrypt.hash(input.password, authConfig.bcrypt.saltRounds)

    const user = await userRepository.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      phoneNumber: input.phoneNumber,
    })

    const verifyToken = crypto.randomBytes(32).toString('hex')
    verificationTokens.set(verifyToken, {
      email: user.email,
      expiresAt: Date.now() + authConfig.emailVerification.expiresInMs,
    })

    logger.info('User registered', { userId: user.id })

    return { user, verifyToken }
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email)
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password')
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash)
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    // if (!user.isVerified) {
    //   throw new Error('Please verify your email before logging in')
    // }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id, role: user.role, email: user.email }),
      signRefreshToken({ userId: user.id, role: user.role, email: user.email }),
    ])

    await setAuthCookies(accessToken, refreshToken)

    logger.info('User logged in', { userId: user.id })

    return {
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
      accessToken,
    }
  }

  async logout() {
    await clearAuthCookies()
  }

  async verifyEmail(token: string) {
    const record = verificationTokens.get(token)
    if (!record) throw new Error('Invalid or expired verification token')
    if (Date.now() > record.expiresAt) {
      verificationTokens.delete(token)
      throw new Error('Verification token has expired')
    }

    const user = await userRepository.findByEmail(record.email)
    if (!user) throw new Error('User not found')

    await userRepository.update(user.id, { isVerified: true })
    verificationTokens.delete(token)

    logger.info('Email verified', { userId: user.id })
    return user
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email)
    // Return success even if user doesn't exist (security)
    if (!user) return

    const resetToken = crypto.randomBytes(32).toString('hex')
    resetTokens.set(resetToken, {
      email: user.email,
      expiresAt: Date.now() + authConfig.passwordReset.expiresInMs,
    })

    logger.info('Password reset requested', { email })
    return resetToken
  }

  async resetPassword(token: string, newPassword: string) {
    const record = resetTokens.get(token)
    if (!record) throw new Error('Invalid or expired reset token')
    if (Date.now() > record.expiresAt) {
      resetTokens.delete(token)
      throw new Error('Reset token has expired')
    }

    const user = await userRepository.findByEmail(record.email)
    if (!user) throw new Error('User not found')

    const passwordHash = await bcrypt.hash(newPassword, authConfig.bcrypt.saltRounds)
    await userRepository.update(user.id, { passwordHash })
    resetTokens.delete(token)

    logger.info('Password reset', { userId: user.id })
  }

  async handleGoogleOAuth(googleUser: {
    id: string
    email: string
    name: string
    accessToken: string
  }) {
    let user = await userRepository.findByEmail(googleUser.email)

    if (!user) {
      user = await userRepository.create({
        fullName: googleUser.name,
        email: googleUser.email,
        isVerified: true,
      })
    }

    await userRepository.upsertOAuthAccount({
      userId: user.id,
      provider: 'google',
      providerUserId: googleUser.id,
      accessToken: googleUser.accessToken,
    })

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken({ userId: user.id, role: user.role, email: user.email }),
      signRefreshToken({ userId: user.id, role: user.role, email: user.email }),
    ])

    await setAuthCookies(accessToken, refreshToken)

    return {
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
      accessToken,
    }
  }
}

export const authService = new AuthService()