import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'
import { resetPasswordSchema } from '@/validations/auth.schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)

    await authService.resetPassword(token, password)

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}