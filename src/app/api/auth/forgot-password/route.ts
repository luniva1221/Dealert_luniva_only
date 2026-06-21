import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'
import { forgotPasswordSchema } from '@/validations/auth.schema'
import { env } from '@/lib/env'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { ResetPasswordTemplate } from '@/emails/reset-password'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const resetToken = await authService.forgotPassword(email)

    if (resetToken) {
      const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      const html = ResetPasswordTemplate({ userName: 'User', resetUrl })

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your Dealert password',
        html,
      })
    }

    // Always return success
    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}