import { NextRequest, NextResponse } from 'next/server'
import { fakePageService } from '@/services/fake-page.service'
import { fakePageCheckSchema } from '@/validations/fake-page.schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = fakePageCheckSchema.parse(body)

    const report = await fakePageService.checkUrl(url)
    return NextResponse.json(report)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}