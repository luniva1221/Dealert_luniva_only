import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'
import { notificationService } from '@/services/notification.service'
import { registerSchema } from '@/validations/auth.schema'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = registerSchema.parse(body)

    const { user, verifyToken } = await authService.register(input)

    const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`

    // Send verification email (non-blocking)
    notificationService.sendAlertEmail({
      to: user.email,
      userName: user.fullName,
      productName: '',
      targetPrice: 0,
      currentPrice: 0,
      productUrl: verificationUrl,
      alertId: 'verify',
      userId: user.id,
    }).catch(() => {})

    return NextResponse.json(
      { message: 'Registration successful. Please check your email to verify your account.' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}