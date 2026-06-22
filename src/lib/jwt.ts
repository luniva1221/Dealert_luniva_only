import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { env } from '@/lib/env'
import { authConfig } from '@/config/auth.config'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface TokenPayload extends JWTPayload {
  userId: string
  role: string
  email: string
}

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET)
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET)

export async function signAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(authConfig.jwt.accessExpiresIn)
    .sign(accessSecret)
}

export async function signRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(authConfig.jwt.refreshExpiresIn)
    .sign(refreshSecret)
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret)
  return payload as TokenPayload
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, refreshSecret)
  return payload as TokenPayload
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}