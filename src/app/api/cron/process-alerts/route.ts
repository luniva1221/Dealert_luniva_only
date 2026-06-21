import { NextRequest, NextResponse } from 'next/server'
import { processAlerts } from '@/jobs/process-alerts'
import { env } from '@/lib/env'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await processAlerts()
  return NextResponse.json(result)
}