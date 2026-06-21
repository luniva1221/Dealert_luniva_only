import { NextRequest, NextResponse } from 'next/server'
import { alertService } from '@/services/alert.service'
import { updateAlertSchema } from '@/validations/alert.schema'
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const input = updateAlertSchema.parse(body)

    const alert = await alertService.updateAlert(id, userId, input)
    return NextResponse.json(alert)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await alertService.deleteAlert(id, userId)
    return NextResponse.json({ message: 'Alert deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}