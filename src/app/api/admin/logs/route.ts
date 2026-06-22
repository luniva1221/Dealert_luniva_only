import { NextRequest, NextResponse } from 'next/server'
import { adminService } from '@/services/admin.service'
import { verifyAccessToken } from '@/lib/jwt'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  if (!token) return null
  try {
    const payload = await verifyAccessToken(token)
    if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') return null
    return payload
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { searchParams } = request.nextUrl
    const logs = await adminService.getCrawlLogs({
      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('limit') ?? 20),
      status: searchParams.get('status') ?? undefined,
    })
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}