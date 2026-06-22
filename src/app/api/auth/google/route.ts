import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { authConfig } from '@/config/auth.config'

export async function GET() {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: authConfig.google.scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent',
  })

  return NextResponse.redirect(`${authConfig.google.authUrl}?${params}`)
}