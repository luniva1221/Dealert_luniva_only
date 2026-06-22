import { NextRequest, NextResponse } from 'next/server'
import { alertService } from '@/services/alert.service'
import { createAlertSchema } from '@/validations/alert.schema'
import { verifyAccessToken } from '@/lib/jwt'

async function getUserId(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('access_token')?.value
  if (!token) return null
  try {
    const payload = await verifyAccessToken(token)
    return payload.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const alerts = await alertService.getUserAlerts(userId)
    return NextResponse.json(alerts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const input = createAlertSchema.parse(body)

    const alert = await alertService.createAlert(userId, input)
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}