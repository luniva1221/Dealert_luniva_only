import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from '@/lib/jwt'
import { setAuthCookies } from '@/lib/cookies'
import { userRepository } from '@/repositories/user.repository'

export async function GET(request: NextRequest) {
  try {
    // 1. Try to verify access token
    const accessToken = request.cookies.get('access_token')?.value
    if (accessToken) {
      try {
        const payload = await verifyAccessToken(accessToken)
        const user = await userRepository.findById(payload.userId)
        if (user) {
          return NextResponse.json({
            user: {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              role: user.role,
              isVerified: user.isVerified,
            },
          })
        }
      } catch {
        // Access token expired, fall back to refresh token check
      }
    }

    // 2. Try to verify refresh token
    const refreshToken = request.cookies.get('refresh_token')?.value
    if (!refreshToken) {
      return NextResponse.json({ user: null })
    }

    const payload = await verifyRefreshToken(refreshToken)
    const user = await userRepository.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // 3. Issue new access token and rotate cookies
    const newAccessToken = await signAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })

    // Set updated cookies in the response
    await setAuthCookies(newAccessToken, refreshToken)

    return response
  } catch {
    return NextResponse.json({ user: null })
  }
}
