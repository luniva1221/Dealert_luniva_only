import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'
import { env } from '@/lib/env'
import { authConfig } from '@/config/auth.config'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`)
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch(authConfig.google.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    // Get user info
    const userInfoRes = await fetch(authConfig.google.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userInfoRes.json()

    await authService.handleGoogleOAuth({
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      accessToken: tokens.access_token,
    })

    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/dashboard`)
  } catch {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`)
  }
}