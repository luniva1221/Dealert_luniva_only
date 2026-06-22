import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/services/auth.service'
import { loginSchema } from '@/validations/auth.schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)

    const result = await authService.login(input)

    return NextResponse.json({ user: result.user }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}