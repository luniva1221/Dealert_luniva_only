import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt'
import { setAuthCookies } from '@/lib/cookies'
import { userRepository } from '@/repositories/user.repository'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    }

    const payload = await verifyRefreshToken(refreshToken)
    const user = await userRepository.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const newAccessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    })

    await setAuthCookies(newAccessToken, refreshToken)

    return NextResponse.json({ message: 'Token refreshed' })
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }
}